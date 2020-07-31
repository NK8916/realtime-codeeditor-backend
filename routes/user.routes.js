const express = require("express");
const router = express.Router();
const { login, register, verify } = require("../controller/user.controller");

router.post("/register", register);
router.post("/verify", verify);
router.post("/login", login);

module.exports = router;
