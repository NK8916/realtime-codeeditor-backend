const service = require("../services/user.service");

exports.login = async (req, res, next) => {};

exports.register = async (req, res, next) => {
  try {
    console.log(req.body);
    const result = await service.register(req.body);
    if (result) {
      res.status(200).send(result);
    }
  } catch (error) {
    res.status(400).send("Not Registered");
  }
};
