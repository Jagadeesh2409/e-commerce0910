const knex = require("../db/knexConfig");
const generateOTP = require("../utils/otpGenerator");
const sendEmail = require("../utils/sendEmail");

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await knex("users").where({ email }).first();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    console.log(otp, expires);

    await knex("users")
      .where({ id: user.id })
      .update({ reset_token: otp, reset_token_expires: expires });

    await sendEmail(email, "Password Reset OTP", otp);

    res.json({ message: "OTP sent successfully to your email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const bcrypt = require("bcrypt");

const resetPassword = async (req, res) => {
  const { email, otp, newPassword, newPassword2 } = req.body;

  if (!email || !otp || !newPassword || !newPassword2) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (newPassword !== newPassword2) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  try {
    const user = await knex("users")
      .where({ email, reset_token: otp })
      .andWhere("reset_token_expires", ">", new Date())
      .first();

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await knex("users").where({ id: user.id }).update({
      password_hash: hashedPassword,
      reset_token: null,
      reset_token_expires: null,
    });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = { forgotPassword, resetPassword };
