"use strict";
const { Contract } = require("fabric-contract-api");

/**
 * Txng bln contract
 */
class TxngBlnContract extends Contract {
  // query block data by id
  async queryBlockById(ctx, blockId) {
    let blockAsBytes = await ctx.stub.getState(blockId);
    if (!blockAsBytes) {
      throw new Error(`Get block data with this id ${blockId} does not exist`);
    }
    // let block = JSON.parse(blockAsBytes.toString());
    return blockAsBytes.toString();
  }

  // add block data
  // blockId: String
  // blockData: String
  async addBlock(ctx, blockId, blockData) {
    // await ctx.stub.putState(studentId, Buffer.from(JSON.stringify(marks)));
    try {
      await ctx.stub.putState(blockId, Buffer.from(blockData.toString()));
      console.log("Block data added to the ledger succesfully");
    } catch (err) {
      console.log("Add block error: ", err);
      return false;
    }
    return true;
  }

  // delete block data by id
  async deleteBlockById(ctx, blockId) {
    try {
      await ctx.stub.deleteState(blockId);
      console.log("Block data deleted from the ledger succesfully");
    } catch (err) {
      console.log("Delete block error: ", err);
      return false;
    }
    return true;
  }
}

module.exports = TxngBlnContract;