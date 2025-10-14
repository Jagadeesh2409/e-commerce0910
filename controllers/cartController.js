const knex = require("../db/knexConfig");
const {
  SucessResponse,
  ErrorResponse,
  responsesMessages,
} = require("../utils/responses");

const addCart = async (req, res) => {
  const user_id = req.user.id;
  const { product_id } = req.body;

  try {
    const exist = await knex("cart_items")
      .where({ user_id, product_id })
      .first();

    if (exist) {
      await knex("cart_items")
        .where({ user_id, product_id })
        .update({ quantity: exist.quantity + 1 });

      return SucessResponse(res, null, responsesMessages.CART_UPDATED);
    }

    const [insertedId] = await knex("cart_items").insert({
      user_id,
      product_id,
      quantity: 1,
    });

    const newCartItem = await knex("cart_items")
      .where({ id: insertedId })
      .first();
    SucessResponse(res, newCartItem, responsesMessages.CART_ADDED);
  } catch (error) {
    console.error("Error in cart add:", error);
    ErrorResponse(res, responsesMessages.ISE);
  }
};

const deleteCart = async (req, res) => {
  const user_id = req.user.id;
  const { id } = req.params;
  const data = req.body;
  const product_id = id;

  try {
    const exist = await knex("cart_items")
      .where({ user_id, product_id })
      .first();

    if (!exist) {
      return ErrorResponse(res, "Item not found in cart", 404);
    }

    if (exist.quantity === 1 || data.empty) {
      const data = await knex("cart_items")
        .where({ user_id, product_id })
        .del();
      return SucessResponse(res, data, responsesMessages.CART_REMOVED);
    }

    await knex("cart_items")
      .where({ user_id, product_id })
      .update({ quantity: exist.quantity - 1 });

    SucessResponse(res, null, responsesMessages.CART_UPDATED);
  } catch (error) {
    console.error("Error in deleting cart:", error);
    ErrorResponse(res, responsesMessages.ISE);
  }
};

const listCart = async (req, res) => {
  const user_id = req.user.id;

  try {
    const data = await knex("cart_items as c")
      .join("products as p", "c.product_id", "p.id")
      .where("c.user_id", user_id)
      .select(
        "c.product_id",
        "c.quantity",
        "p.selling_price as price",
        knex.raw("(c.quantity * p.selling_price) as total_price")
      );

    if (data.length === 0) {
      return ErrorResponse(res, "Your cart is empty", 404);
    }

    SucessResponse(res, data, responsesMessages.CART_LIST);
  } catch (error) {
    console.error("Problem in listCart:", error);
    ErrorResponse(res, responsesMessages.ISE);
  }
};

module.exports = { addCart, deleteCart, listCart };
