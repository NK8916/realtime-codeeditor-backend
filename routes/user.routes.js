const express = require("express");
const router = express.Router();
const {
  login,
  register,
  verify,
  forgotPassword,
  resetPassword,
} = require("../controller/user.controller");

router.post("/register", register);
router.post("/verify", verify);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
