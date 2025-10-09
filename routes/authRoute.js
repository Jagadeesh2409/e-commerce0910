const express = require("express");
const authRoute = express.Router();
const { register, login } = require("../controllers/authController");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordController");

authRoute.post("/forgot-password", forgotPassword);
authRoute.post("/reset-password", resetPassword);

authRoute.post("/register", register);
authRoute.post("/login", login);

module.exports = authRoute;
