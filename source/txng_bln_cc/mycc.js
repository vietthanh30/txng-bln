"use strict";
const { Contract } = require("fabric-contract-api");

/**
 * Txng bln contract
 */
class TxngBlnContract extends Contract {
  // query block data by id
  async queryBlockById(stub, args) {
    let blockId = args[0];
    let blockAsBytes = await stub.getState(blockId);
    if (!blockAsBytes) {
      throw new Error(`Get block data with this id ${blockId} does not exist`);
    }
    // let block = JSON.parse(blockAsBytes.toString());
    return blockAsBytes;
  }

  // add block data
  // blockId: String
  // blockData: String
  async addBlock(stub, args) {
    let blockId = args[0];
    let blockData = args[1];
    // await ctx.stub.putState(studentId, Buffer.from(JSON.stringify(marks)));
    try {
      await stub.putState(blockId, Buffer.from(blockData));
      console.log("Block data added to the ledger succesfully");
    } catch (err) {
      console.log("Add block error: ", err);
      return false;
    }
    return true;
  }

  // delete block data by id
  async deleteBlockById(stub, args) {
    let blockId = args[0];
    try {
      await stub.deleteState(blockId);
      console.log("Block data deleted from the ledger succesfully");
    } catch (err) {
      console.log("Delete block error: ", err);
      return false;
    }
    return true;
  }
}

module.exports = TxngBlnContract;
