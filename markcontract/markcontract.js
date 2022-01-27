"use strict";

const { Contract } = require("fabric-contract-api");

/**
 * MarkContract
 */
class MarkContract extends Contract {
  /** query marks
   * ctx: fabric contract api
   * studentId: id of student
   */
  async queryMarks(ctx, studentId) {
    console.log("Mark contract queryMarks...");
    // call fabric contract api get state
    let marksAsBytes = await ctx.stub.getState(studentId);
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
  async addMarks(ctx, studentId, subject1, subject2, subject3) {
    console.log("Mark contract addMarks...");
    let marks = {
      subj1: subject1,
      subj2: subject2,
      subj3: subject3,
    };

    // call fabric contract api save data to ledger
    // key: studentId, value: marks
    await ctx.stub.putState(studentId, Buffer.from(JSON.stringify(marks)));
    console.log("Student marks added to the ledger succesfully...");
  }

  /** delete marks */
  async deleteMarks(ctx, studentId) {
    console.log("Mark contract deleteMarks...");
    // call fabric contract delete block
    await ctx.stub.deleteState(studentId);
    console.log("Student marks deleted from ledger successfully...");
  }
}

module.exports = MarkContract;
