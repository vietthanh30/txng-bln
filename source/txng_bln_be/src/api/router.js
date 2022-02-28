const validate = require("express-validation");
const Joi = require("joi");

const { getHelloWorld } = require("./helloworld");
const { getBlockById } = require("./query");

module.exports = function (router) {
  router.route("/").get(getHelloWorld);
  router.route("/query/blockId/:id").get(getBlockById);
};
