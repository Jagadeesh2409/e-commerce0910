const knex = require("../db/knexConfig");
const {
  SucessResponse,
  ErrorResponse,
  responsesMessages,
} = require("../utils/responses");
const _ = require("lodash");

const addProductCategories = async (req, res) => {
  const { name } = req.body;
  const slug = _.kebabCase(name);

  try {
    const [categoryId] = await knex("categories").insert({ name, slug });
    const newCategory = await knex("categories")
      .where({ id: categoryId })
      .first();
    SucessResponse(res, newCategory, "Category added successfully");
  } catch (error) {
    console.error("Error in addProductCategories:", error);
    ErrorResponse(res, "Error adding category", 400);
  }
};

const removeCategoriesById = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await knex("categories").where({ id }).del();
    if (deleted) {
      SucessResponse(res, deleted, "Category removed successfully");
    } else {
      ErrorResponse(res, "Category not found", 404);
    }
  } catch (error) {
    console.error("Error in removeCategoriesById:", error);
    ErrorResponse(res, "Failed to remove category", 400);
  }
};

const listProductCategories = async (req, res) => {
  try {
    const categories = await knex("categories").select("id", "name");
    if (!categories.length) {
      return ErrorResponse(res, "No categories found", 404);
    }
    SucessResponse(res, categories, responsesMessages.CATEGORY_LISTED);
  } catch (error) {
    console.error("Error in listProductCategories:", error);
    ErrorResponse(res, responsesMessages.ISE);
  }
};

module.exports = {
  addProductCategories,
  removeCategoriesById,
  listProductCategories,
};
