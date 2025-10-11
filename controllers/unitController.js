const knex = require("../db/knexConfig");
const {
  SucessResponse,
  ErrorResponse,
  responsesMessages,
} = require("../utils/responses");

//create unit

const createUnit = async (req, res) => {
  try {
    const data = req.body;
    if (!data.name || !data.abbreviation) {
      ErrorResponse(res, "Name and abbreviation are required", 400);
      return;
    }

    const [newUnit] = await knex("units").insert(data);

    SucessResponse(res, { id: newUnit, ...data }, "Unit created successfully");
  } catch (error) {
    console.error("Error creating unit:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return ErrorResponse(res, "Unit with this name already exists", 400);
    }
    ErrorResponse(res, "Internal server error", 500);
  }
};

//get all units
const getAllUnits = async (req, res) => {
  try {
    const units = await knex("units").select(
      "name",
      "abbreviation",
      "description"
    );

    SucessResponse(res, units, responsesMessages.UNIT_SHOWN);
  } catch (error) {
    console.error("Error fetching units:", error);
    ErrorResponse(res, "Internal server error", 500);
  }
};

//get unit by id
const getUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    const unit = await knex("units").where({ id }).first();
    if (!unit) {
      ErrorResponse(res, "Unit not found", 404);
      return;
    }
    SucessResponse(res, unit);
  } catch (error) {
    console.error("Error fetching unit:", error);
    ErrorResponse(res, "Internal server error", 500);
  }
};

//update unit by id
const updateUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await knex("units").where({ id }).update(data);
    if (!updated) {
      ErrorResponse(res, "Unit not found", 404);
      return;
    }
    SucessResponse(res, { id, ...data }, "Unit updated successfully");
  } catch (error) {
    console.error("Error updating unit:", error);
    ErrorResponse(res, "Internal server error", 500);
  }
};

const deleteUnitById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await knex("units").where({ id }).del();
    if (!deleted) {
      ErrorResponse(res, "Unit not found", 404);
      return;
    }
    SucessResponse(res, null, "Unit deleted successfully");
  } catch (error) {
    console.error("Error deleting unit:", error);
    ErrorResponse(res, "Internal server error", 500);
  }
};

module.exports = {
  createUnit,
  getAllUnits,
  getUnitById,
  updateUnitById,
  deleteUnitById,
};
