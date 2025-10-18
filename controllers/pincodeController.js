const knex = require("../db/knexConfig");
const {
  SucessResponse,
  ErrorResponse,
  responsesMessages,
} = require("../utils/responses");

const createPincode = async (req, res) => {
  try {
    const { pincode, city, state, country, is_serviceable = true } = req.body;

    const exist = await knex("pincodes").where({ pincode }).first();
    if (exist) {
      ErrorResponse(res, "Pincode already exists", 400);
      return;
    }

    const data = await knex("pincodes").insert({
      pincode,
      city,
      state,
      country,
      is_serviceable,
    });

    return SucessResponse(res, data, "Pincode created successfully");
  } catch (error) {
    console.error("Error creating pincode:", error);
    return ErrorResponse(res, responsesMessages.ISE);
  }
};

const getAllPincodes = async (req, res) => {
  try {
    const data = await knex("pincodes").select("*");
    return SucessResponse(res, data, "Pincode list fetched");
  } catch (error) {
    console.error("Error fetching pincodes:", error);
    return ErrorResponse(res, responsesMessages.ISE);
  }
};

const updatePincode = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const exist = await knex("pincodes").where({ id }).first();
    if (!exist) return ErrorResponse(res, "Pincode not found", 404);

    const update = await knex("pincodes").where({ id }).update(data);

    return SucessResponse(res, update, "Pincode updated successfully");
  } catch (error) {
    console.error("Error updating pincode:", error);
    return ErrorResponse(res, responsesMessages.ISE);
  }
};

module.exports = {
  createPincode,
  getAllPincodes,
  updatePincode,
};
