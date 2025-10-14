const knex = require("../db/knexConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  ErrorResponse,
  responsesMessages,
  SucessResponse,
} = require("../utils/responses");
require("dotenv").config();

const register = async (req, res) => {
  const { name, email, password, phone_number } = req.body;

  try {
    const existingUser = await knex("users").where({ email }).first();
    if (existingUser) {
      return ErrorResponse(res, responsesMessages.EXISTRING_USER);
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [newUserId] = await knex("users").insert({
      name,
      email,
      password_hash: hashedPassword,
      phone_number,
      is_admin: false,
    });

    const newUser = await knex("users").where({ id: newUserId }).first();

    return SucessResponse(
      res,
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone_number: newUser.phone_number,
        is_admin: newUser.is_admin,
      },
      responsesMessages.REGISTER
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return ErrorResponse(res, responsesMessages.ISE);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await knex("users").where({ email }).first();
    if (!user) {
      return ErrorResponse(res, responsesMessages.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return ErrorResponse(res, "Invalid email or password");
    }

    const token = jwt.sign(
      { id: user.id, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return SucessResponse(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone_number: user.phone_number,
          is_admin: user.is_admin,
        },
      },
      responsesMessages.LOGIN
    );
  } catch (error) {
    console.error("Error during login:", error);
    return ErrorResponse(res, responsesMessages.ISE);
  }
};

module.exports = {
  register,
  login,
};
