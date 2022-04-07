const Constant = require("../confs/constant");

const getHelloWorld = (req, res) => {
  try {
    let resData = {
      status: Constant.HTTP_CODE.SUCCESSFULLY,
      data: "hello world",
      msg: "successfully",
    };
    res.send(resData);
  } catch (err) {
    console.error("getHelloWorld error: ", err);
    let resData = {
      status: Constant.HTTP_CODE.INTERNAL_SERVER,
      msg: err,
    };
    res.send(resData);
  }
};

module.exports = {
  getHelloWorld,
};
