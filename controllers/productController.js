const knex = require("../db/knexConfig");
const {
  SucessResponse,
  ErrorResponse,
  responsesMessages,
} = require("../utils/responses");

let product = knex("products as c")
  .join("units as p", "c.unit_id", "p.id")
  .select("p.name as unit", "c.*");

const createProduct = async (req, res) => {
  try {
    const data = req.body;

    const [newProduct] = await knex("products").insert(data);

    SucessResponse(
      res,
      { id: newProduct, ...data },
      responsesMessages.PRODUCT_CREATED
    );
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return ErrorResponse(res, "Product with this name already exists", 400);
    }
    ErrorResponse(res, responsesMessages.ISE, 500);
  }
};

const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    data.updated_at = knex.fn.now();
    const updated = await knex("products").where({ id }).update(data);
    console.log(updated);
    if (!updated) {
      ErrorResponse(res, "Product not found", 404);
      return;
    }
    const updatedProduct = await knex("products").where({ id }).first();

    SucessResponse(res, updatedProduct, responsesMessages.PRODUCT_UPDATED);
  } catch (error) {
    console.error("Error updating product:", error);
    ErrorResponse(res, responsesMessages.ISE, 500);
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const get = await product.where("c.id", id).first();
    if (!get) {
      ErrorResponse(res, "Product not found", 404);
      return;
    }
    SucessResponse(res, get, responsesMessages.PRODUCT_SHOWN);
  } catch (error) {
    console.error("Error got product:", error);
    ErrorResponse(res, "Internal server error", 500);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const fetch = await product;

    if (!fetch) {
      ErrorResponse(res, "Product not found", 404);
      return;
    }
    SucessResponse(res, fetch, responsesMessages.PRODUCT_LIST);
  } catch (error) {
    console.error("Error fetch product:", error);
    ErrorResponse(res, responsesMessages.ISE, 500);
  }
};

module.exports = {
  createProduct,
  updateProductById,
  getProductById,
  getAllProducts,
};
