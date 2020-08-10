const {
  register,
  verify,
  login,
  forgotPassword,
  resetPassword,
} = require("../services/user.service");

exports.forgotPassword = async (req, res, next) => {
  try {
    const result = await forgotPassword(req.body);
    res.status(result.statusCode);
  } catch (error) {
    res.status(400).send(error);
  }
};
exports.login = async (req, res, next) => {
  try {
    const result = await login(req.body);
    console.log(result);
    res
      .status(result.statusCode)
      .json({ token: result.token, message: result.message });
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.verify = async (req, res, next) => {
  try {
    const result = await verify(req.body);

    res
      .status(result.statusCode)
      .json({ token: result.token, message: result.message });
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

exports.resetPassword = async (req, res, next) => {
  try {
    const result = await resetPassword(req.body);
    res.status(result.statusCode).send(result.message);
  } catch (error) {
    res.status(400).send("Unable To Change Password");
  }
};
