const { register, verify } = require("../services/user.service");

exports.login = async (req, res, next) => {};

exports.verify = async (req, res, next) => {
  try {
    const result = await verify(req.body);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await register(req.body);
    if (result) {
      res.status(result.statusCode).send(result.message);
    }
  } catch (error) {
    res.status(400).send("Not Registered");
  }
};
