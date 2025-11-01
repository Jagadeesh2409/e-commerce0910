const knex = require("../db/knexConfig");
const {
  SucessResponse,
  ErrorResponse,
  responsesMessages,
} = require("../utils/responses");
const XLSX = require("xlsx");

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

const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const deleted = await knex("products").where({ id }).del();
    if (!deleted) {
      ErrorResponse(res, "Product not found", 404);
      return;
    }
    SucessResponse(res, deleted, responsesMessages.PRODUCT_DELETED);
  } catch (error) {
    console.error("Error deleting product:", error);
    ErrorResponse(res, responsesMessages.ISE, 500);
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
    SucessResponse(res, get, responsesMessages.PRODUCT_SHOWN);
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
    SucessResponse(res, fetch, responsesMessages.PRODUCT_LIST);
  } catch (error) {
    console.error("Error fetch product:", error);
    ErrorResponse(res, responsesMessages.ISE, 500);
  }
};

const bulkUpload = async (req, res, next) => {
  try {
    let path = req.file.path;
    var workbook = XLSX.readFile(path);
    var sheet_name_list = workbook.SheetNames;
    let jsonData = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheet_name_list[0]]
    );

    if (jsonData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "xml sheet has no data",
      });
    }

    const chunkSize = 100;

    knex
      .batchInsert("products", jsonData, chunkSize)
      .then(function (ids) {
        console.log(ids);
          return res.status(201).json({
          success: true,
          message:ids+ " rows added to the database",
        });
      })
      .catch(function (error) {
        console.log(error.message);
      });

    
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const getBulkData = async (req, res) => {
  try {
    const { categories } = req.body || {};
    let data;
    categories
      ? (data = await knex("products").select("*").where("categories"))
      : (data = await knex("products").select("*"));
    res.status(200).json({ message: "success", data });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createProduct,
  updateProductById,
  deleteProductById,
  getProductById,
  getAllProducts,
  bulkUpload,
  getBulkData,
};
