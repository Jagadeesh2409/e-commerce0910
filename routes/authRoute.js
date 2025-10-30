const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordController");


router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/register", register);
router.post("/login", login);

const passport = require("passport");

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // req.user now includes { id, name, email, token, ... }
    const token = req.user.token;
    // You can send it as JSON or redirect with token in query
    res.json({ message: "Login successful", token, user: req.user });
  }
);

module.exports = router;



