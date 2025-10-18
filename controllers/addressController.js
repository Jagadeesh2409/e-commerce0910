const knex = require("../db/knexConfig");
const {
  SucessResponse,
  ErrorResponse,
  responsesMessages,
} = require("../utils/responses");

const createAddress = async (req, res) => {
  try {
    const user_id = req.user.id;
    const data = req.body;

    const pin = await knex("pincodes").where({ pincode: data.pin_code });

    if (!pin) {
      ErrorResponse(res, "service is not applcable for your location");
      return;
    }

    if (data.is_default) {
      await knex("user_addresses")
        .where({ user_id })
        .update({ is_default: false });
    }
    data.user_id = user_id;
    await knex("user_addresses").insert(data);

    return SucessResponse(res, null, "Address added successfully");
  } catch (error) {
    console.error("Error creating address:", error);
    return ErrorResponse(res, "Internal server error");
  }
};

const listAddress = async (req, res) => {
  try {
    const user_id = req.user.id;
    const addresses = await knex("user_addresses")
      .where({ user_id })
      .select("*")
      .orderBy("is_default", "desc");

    return SucessResponse(res, addresses, "Address list fetched");
  } catch (error) {
    console.error("Error listing addresses:", error);
    return ErrorResponse(res, "Internal server error");
  }
};

const updateAddress = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;
    const data = req.body;

    const exist = await knex("user_addresses").where({ id, user_id }).first();
    if (!exist) return ErrorResponse(res, "Address not found", 404);

    if (data.is_default) {
      await knex("user_addresses")
        .where({ user_id })
        .update({ is_default: false });
    }
    data.updated_at = knex.fn.now();
    await knex("user_addresses").where({ id }).update({ data });

    return SucessResponse(res, null, "Address updated successfully");
  } catch (error) {
    console.error("Error updating address:", error);
    return ErrorResponse(res, "Internal server error");
  }
};

const deleteAddress = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const exist = await knex("user_addresses").where({ id, user_id }).first();
    if (!exist) return ErrorResponse(res, "Address not found", 404);

    await knex("user_addresses").where({ id }).del();
    return SucessResponse(res, null, "Address deleted successfully");
  } catch (error) {
    console.error("Error deleting address:", error);
    return ErrorResponse(res, "Internal server error");
  }
};

module.exports = {
  createAddress,
  listAddress,
  updateAddress,
  deleteAddress,
};
