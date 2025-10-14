const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordController");

const validator = require("express-joi-validation").createValidator({});
const { loginV, registerV } = require("../middleware/validator");

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/register", validator.body(registerV), register);
router.post("/login", validator.body(loginV), login);

module.exports = router;
