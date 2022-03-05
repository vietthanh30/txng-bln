"use strict";
const { Contract } = require("fabric-contract-api");

/**
 * Txng bln contract
 */
class TxngBlnContract extends Contract {
  // query block data by id
  async queryBlockById(ctx, blockId) {
    console.info("queryBlockById ctx: ", ctx);
    console.info("queryBlockById blockId: ", blockId);
    let blockAsBytes = await ctx.stub.getState(blockId);
    if (!blockAsBytes) {
      throw new Error(`Get block data with this id ${blockId} does not exist`);
    }
    let block = blockAsBytes.toString();
    console.info("queryBlockById blockAsBytes: ", blockAsBytes);
    console.info("queryBlockById response: ", block);

    return block;
  }

  // add block data
  // blockId: String
  // blockData: String
  async addBlock(ctx, blockId, blockData) {
    // await ctx.stub.putState(studentId, Buffer.from(JSON.stringify(marks)));
    try {
      await ctx.stub.putState(blockId, Buffer.from(blockData));
      console.log("Block data added to the ledger succesfully");
    } catch (err) {
      console.log("Add block error: ", err);
      return false;
    }
    return true;
  }

  // query all block
  async queryAllBlock(ctx) {
    const startKey = "CAR0";
    const endKey = "CAR999";

    const iterator = await ctx.stub.getStateByRange(startKey, endKey);

    const allResults = [];
    while (true) {
      const res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        console.log(res.value.value.toString("utf8"));

        const Key = res.value.key;
        let Record;
        try {
          Record = JSON.parse(res.value.value.toString("utf8"));
        } catch (err) {
          console.log(err);
          Record = res.value.value.toString("utf8");
        }
        allResults.push({ Key, Record });
      }
      if (res.done) {
        console.log("end of data");
        await iterator.close();
        console.info(allResults);
        return JSON.stringify(allResults);
      }
    }
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
