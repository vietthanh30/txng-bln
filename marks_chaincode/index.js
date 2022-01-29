/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const shim = require("fabric-shim");
const util = require("util");

var Chaincode = class {
  /** Init chaincode
   * stub: fabric contract api
   */
  async Init(stub) {
    console.log("Mark contract init...");

    // args
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let args = ret.params;
    let studentId = args[0];

    let marks = {
      subj1: asrs[1], // subject1
      subj2: args[2], // subject2
      subj3: args[3], // subject3
    };

    try {
      // call fabric contract api save data to ledger
      // key: studentId, value: marks
      await stub.putState(studentId, Buffer.from(JSON.stringify(marks)));
      console.log("Student marks added to the ledger succesfully...");
      return shim.success();
    } catch (err) {
      return shim.error(err);
    }
  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let method = this[ret.fcn];
    if (!method) {
      console.log("no method of name:" + ret.fcn + " found");
      return shim.success();
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  async invoke(stub, args) {
    if (args.length != 3) {
      throw new Error("Incorrect number of arguments. Expecting 3");
    }

    let A = args[0];
    let B = args[1];
    if (!A || !B) {
      throw new Error("asset holding must not be empty");
    }

    // Get the state from the ledger
    let Avalbytes = await stub.getState(A);
    if (!Avalbytes) {
      throw new Error("Failed to get state of asset holder A");
    }
    let Aval = parseInt(Avalbytes.toString());

    let Bvalbytes = await stub.getState(B);
    if (!Bvalbytes) {
      throw new Error("Failed to get state of asset holder B");
    }

    let Bval = parseInt(Bvalbytes.toString());
    // Perform the execution
    let amount = parseInt(args[2]);
    if (typeof amount !== "number") {
      throw new Error("Expecting integer value for amount to be transaferred");
    }

    Aval = Aval - amount;
    Bval = Bval + amount;
    console.info(util.format("Aval = %d, Bval = %d\n", Aval, Bval));

    // Write the states back to the ledger
    await stub.putState(A, Buffer.from(Aval.toString()));
    await stub.putState(B, Buffer.from(Bval.toString()));
  }

  // Deletes an entity from state
  async delete(stub, args) {
    if (args.length != 1) {
      throw new Error("Incorrect number of arguments. Expecting 1");
    }

    let A = args[0];

    // Delete the key from the state in ledger
    await stub.deleteState(A);
  }

  // query callback representing the query of a chaincode
  async query(stub, args) {
    if (args.length != 1) {
      throw new Error(
        "Incorrect number of arguments. Expecting name of the person to query"
      );
    }

    let jsonResp = {};
    let A = args[0];

    // Get the state from the ledger
    let Avalbytes = await stub.getState(A);
    if (!Avalbytes) {
      jsonResp.error = "Failed to get state for " + A;
      throw new Error(JSON.stringify(jsonResp));
    }

    jsonResp.name = A;
    jsonResp.amount = Avalbytes.toString();
    console.info("Query Response:");
    console.info(jsonResp);
    return Avalbytes;
  }
};

shim.start(new Chaincode());