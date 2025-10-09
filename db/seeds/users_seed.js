const bcrypt = require("bcrypt");

exports.seed = async function (knex) {
  // Delete existing users
  await knex("users").del();

  // Hash passwords
  const hashedPassword1 = await bcrypt.hash("password123", 10); // 10 = salt rounds
  const hashedPassword2 = await bcrypt.hash("admin456", 10);

  await knex("users").insert([
    {
      name: "John Doe",
      email: "john@example.com",
      password_hash: hashedPassword1,
      phone_number: "1234567890",
      is_admin: false,
    },
    {
      name: "Admin User",
      email: "admin@example.com",
      password_hash: hashedPassword2,
      phone_number: "9876543210",
      is_admin: true,
    },
  ]);
};
