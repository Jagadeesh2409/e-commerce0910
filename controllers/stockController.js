const knex = require("../db/knexConfig");
const { SucessResponse, ErrorResponse } = require("../utils/responses");

const stockControl = async (productId, quantity, operation) => {
  try {
    const product = await knex("products").where(productId).first();
    if (!product) {
      console.log("product not found");
      return false;
    }

    product.stock =
      operation == "add" ? product.stock + quantity : product.stock - quantity;
    await knex("products").where({ id: product.id }).update(product);
    return true;
  } catch (error) {
    console.log("error in stock update");
  }
};

module.exports = { stockControl };
