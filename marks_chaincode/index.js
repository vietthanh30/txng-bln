/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const shim = require("fabric-shim");

var MarksChaincode = class {
  /** Init chaincode
   * stub: fabric contract api
   */
  async init(stub) {
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

  /** query marks
   * stub: fabric contract api
   * studentId: id of student
   */
  async queryMarks(stub) {
    console.log("Mark contract queryMarks...");

    // args
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let args = ret.params;
    let studentId = args[0];

    // call fabric contract api get state
    let marksAsBytes = await stub.getState(studentId);
    if (!marksAsBytes || marksAsBytes.toString().length <= 0) {
      throw new Error("Student with this  id does not exist");
    }

    let marks = JSON.parse(marksAsBytes.toString());
    return JSON.toString(marks);
  }

  /** add marks
   * ctx: fabric contract api
   * studentId: id of stuent
   * subject1: mark of subject1
   * subject2: mark of subject2
   * subject3: mark of subject3
   */
  async addMarks(stub) {
    console.log("Mark contract addMarks...");

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

  /** delete marks */
  async deleteMarks(stub) {
    console.log("Mark contract deleteMarks...");

    // args
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let args = ret.params;
    let studentId = args[0];

    try {
      // call fabric contract delete block
      await stub.deleteState(studentId);
      console.log("Student marks deleted from ledger successfully...");
      return shim.success();
    } catch (err) {
      return shim.error(err);
    }
  }
};

shim.start(new MarksChaincode());
