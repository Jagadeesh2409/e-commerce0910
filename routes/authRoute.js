const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordController");
require('dotenv').config()


router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/register", register);
router.post("/login", login);


const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const knex = require("../db/knexConfig");

// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ✅ Step 1: Redirect user to Google login page
router.get("/google", (req, res) => {
  const redirect_uri = "http://localhost:5000/auth/google/callback";
  const scope = [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
  ].join(" ");

  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&access_type=offline`;

  res.redirect(url);
});

// ✅ Step 2: Handle callback after Google login
router.get("/google/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const redirect_uri = "http://localhost:5000/auth/google/callback";
    const client = new OAuth2Client({client_id:process.env.GOOGLE_CLIENT_ID,client_secret:process.env.GOOGLE_CLIENT_SECRET,redirectUri:redirect_uri});
    const r = await client.getToken(code);
   
console.log(r.tokens)

client.setCredentials(r.tokens)
    // Get user info from Google
    const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${r.tokens.access_token}` },
    });
    const profile = await response.json();

    console.log("✅ Google user:", profile);

    // Check if user exists in DB
    let user = await knex("users").where({ email: profile.email }).first();

    if (!user) {
      const [id] = await knex("users").insert({
        name: profile.name,
        email: profile.email,
        google_id: profile.id,
        profile_img: profile.picture,
        login_provider: "google",
      });
      user = await knex("users").where({ id }).first();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET
    );

    // Redirect or return token

    res.json({
        name: profile.name,
        email: profile.email,
        google_id: profile.id,
        profile_img: profile.picture,
        login_provider: "google",
        token
      })
  } catch (error) {
    console.error("❌ Google Auth Error:", error.message);
    res.status(500).send("Authentication failed");
  }
});




module.exports = router;



