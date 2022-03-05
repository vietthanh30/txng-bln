const validate = require("express-validation");
const Joi = require("joi");

const { getHelloWorld } = require("./helloworld");
const { getBlockById, getAllBlock } = require("./query");
const { addBlock } = require("./invoke");

module.exports = function (router) {
  router.route("/").get(getHelloWorld);
  router.route("/query/blockId/:id").get(getBlockById);
  router.route("/query/allblock/:startKey/:endKey").get(getAllBlock);

  router.route("/addblock").post(
    validate({
      body: {
        id: Joi.string().required(),
        title: Joi.string().required(),
        date: Joi.string().required(),
        description: Joi.string().required(),
        author: Joi.string().required(),
      },
    }),
    addBlock
  );
};
