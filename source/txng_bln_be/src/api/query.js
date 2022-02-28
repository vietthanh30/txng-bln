const Constant = require("../confs/constant");

const getBlockById = (req, res) => {
  try {
    let blockId = req.params.id;
    let resData = {
      status: Constant.HTTP_CODE.SUCCESSFULLY,
      data: blockId,
      msg: "successfully",
    };
    res.send(resData);
  } catch (err) {
    console.error("getBlockId error: ", err);
    let resData = {
      status: Constant.HTTP_CODE.INTERNAL_SERVER,
      msg: err,
    };
    res.send(resData);
  }
};

module.exports = {
  getBlockById,
};
