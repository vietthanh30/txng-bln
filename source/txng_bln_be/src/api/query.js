const { FileSystemWallet, Gateway } = require("fabric-network");

const Constant = require("../confs/constant");

const getBlockById = async (req, res) => {
  try {
    // Create a new file system based wallet for managing identities.
    // const walletPath = path.join(process.cwd(), "wallet");
    const walletPath = Constant.WALLET_PATH;
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists("admin");
    if (!userExists) {
      console.log(
        'An identity for the user "admin" does not exist in the wallet'
      );
      console.log("Run the registerUser.js application before retrying");
      let resData = {
        status: Constant.HTTP_CODE.INTERNAL_SERVER,
        msg: 'An identity for the user "admin" does not exist in the wallet',
      };
      res.send(resData);
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(Constant.CONNECTION_ORG1_PATH, {
      wallet,
      identity: "admin",
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(Constant.CHANNEL_NAME);

    // Get the contract from the network.
    const contract = network.getContract(Constant.CHAINCODE_NAME);

    let blockId = req.params.id;

    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.evaluateTransaction(
      "queryBlockById",
      blockId
    );
    console.log(
      `Transaction has been evaluated, result is: ${result.toString()}`
    );

    let resData = {
      status: Constant.HTTP_CODE.SUCCESSFULLY,
      data: {
        key: blockId,
        blockData: result.toString(),
      },
      msg: "successfully",
    };
    res.send(resData);
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    console.error("getBlockId error: ", error);
    let resData = {
      status: Constant.HTTP_CODE.INTERNAL_SERVER,
      msg: error,
    };
    res.send(resData);
  }

  try {
  } catch (err) {}
};

module.exports = {
  getBlockById,
};
