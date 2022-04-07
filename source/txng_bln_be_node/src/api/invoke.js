const { FileSystemWallet, Gateway } = require("fabric-network");

const Constant = require("../confs/constant");

const addBlock = async (req, res) => {
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
      discovery: { enabled: true, asLocalhost: false },
    });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork(Constant.CHANNEL_NAME);

    // Get the contract from the network.
    const contract = network.getContract(Constant.CHAINCODE_NAME);

    // Submit the specified transaction.
    // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
    // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')

    let reqBodyData = req.body;
    let blockId = reqBodyData.id;
    let blockData = {
      id: blockId,
      title: reqBodyData.title,
      date: reqBodyData.date,
      description: reqBodyData.description,
      author: reqBodyData.author,
    };

    console.log("Block data: ", blockData);

    await contract.submitTransaction(
      "addBlock",
      blockId,
      JSON.stringify(blockData)
    );
    console.log("Transaction has been submitted");

    // Disconnect from the gateway.
    await gateway.disconnect();

    // response
    let resData = {
      status: Constant.HTTP_CODE.SUCCESSFULLY,
      data: {
        key: blockId,
        blockData: blockData,
      },
      msg: "successfully",
    };
    res.send(resData);
  } catch (error) {
    console.error(`Failed to submit transaction: ${error}`);
    let resData = {
      status: Constant.HTTP_CODE.INTERNAL_SERVER,
      msg: error,
    };
    res.send(resData);
  }
};

module.exports = {
  addBlock,
};
