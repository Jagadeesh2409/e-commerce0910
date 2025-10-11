const knex = require("../db/knexConfig");
const {
  SucessResponse,
  ErrorResponse,
  responsesMessages,
} = require("../utils/responses");

//creare product
const createProduct = async (req, res) => {
  try {
    const data = req.body;
    if (
      !data.name ||
      !data.purchase_price ||
      !data.MRP_price ||
      !data.unit_id ||
      !data.brand ||
      !data.stock ||
      !data.selling_price
    ) {
      ErrorResponse(res, "Name, price, and unit_id are required", 400);
      return;
    }

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
    if (!updated) {
      ErrorResponse(res, "Product not found", 404);
      return;
    }
    const updatedProduct = await knex("products").where({ id }).first();
    SucessResponse(res, updatedProduct, "Product updated successfully");
  } catch (error) {
    console.error("Error updating product:", error);
    ErrorResponse(res, "Internal server error", 500);
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const deleted = await knex("products").where({ id }).del();
    if (!deleted) {
      ErrorResponse(res, "Product not found", 404);
      return;
    }
    SucessResponse(res, null, "Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
    ErrorResponse(res, "Internal server error", 500);
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const get = await knex("products").where({ id }).first();
    if (!get) {
      ErrorResponse(res, "Product not found", 404);
      return;
    }
    SucessResponse(res, get, "Product got successfully");
  } catch (error) {
    console.error("Error got product:", error);
    ErrorResponse(res, "Internal server error", 500);
  }
};

const getAllProducts = async (req, res) => {
  try {
    const fetch = await knex("products").select("*");
    if (!fetch) {
      ErrorResponse(res, "Product not found", 404);
      return;
    }
    SucessResponse(res, fetch, "Product fetching successfully");
  } catch (error) {
    console.error("Error fetch product:", error);
    ErrorResponse(res, "Internal server error", 500);
  }
};

module.exports = {
  createProduct,
  updateProductById,
  deleteProductById,
  getProductById,
  getAllProducts,
};

/*
impotant fields:
- name
- brand
- stock
- image_url
- short_description
- full_description
- unit_id (foreign key to units table)
- product_details (JSON for attributes like color, size)
- purchase_price
- MRP_price
- discount
- tax
- selling_price
- category_ids (JSON array of category IDs)
- created_at
- updated_at
 */

/*
manitory fields:
- name
- price
- unit_id 
*/
