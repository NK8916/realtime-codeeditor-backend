const { register, verify, login } = require("../services/user.service");

exports.login = async (req, res, next) => {
  try {
    const result = await login(req.body);
    console.log(result);
    res
      .cookie("token", { token: result.token }, { httpOnly: true })
      .status(result.statusCode)
      .send(result.message);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const result = await verify(req.body);
    console.log("result", result);
    res.cookie("token", { token: result.token }, { httpOnly: true });
    res.status(result.statusCode).send(result.message);
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
