const knex = require("../db/knexConfig");
const {
  SucessResponse,
  ErrorResponse,
  responsesMessages,
} = require("../utils/responses");

const { getCartDetails } = require("../utils/cartUtil");

const addToCart = async (req, res) => {
  const user_id = req.user.id;
  const { product_id } = req.body;

  try {
    const product = await knex("products").where({ id: product_id }).first();
    if (!product) return res.status(404).json({ message: "Product not found" });

    const exist = await knex("cart_items")
      .where({ user_id, product_id })
      .first();

    if (exist) {
      await knex("cart_items")
        .where({ user_id, product_id })
        .update({
          quantity: exist.quantity + 1,
          updated_at: knex.fn.now(),
        });
    } else {
      await knex("cart_items").insert({
        user_id,
        product_id,
        quantity: 1,
      });
    }

    const updatedCart = await getCartDetails(user_id);

    res.json({
      message: "Cart updated successfully",
      cart: updatedCart,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const removeFromCart = async (req, res) => {
  const user_id = req.user.id;
  const { product_id, empty } = req.body;

  try {
    if (empty === true) {
      await knex("cart_items").where({ user_id }).del();
      return res.json({
        message: "Cart emptied successfully",
        cart: [],
      });
    }

    const exist = await knex("cart_items")
      .where({ user_id, product_id })
      .first();

    if (!exist)
      return res.status(404).json({ message: "Product not found in cart" });

    if (exist.quantity > 1) {
      await knex("cart_items")
        .where({ user_id, product_id })
        .update({
          quantity: exist.quantity - 1,
          updated_at: knex.fn.now(),
        });
    } else {
      await knex("cart_items").where({ user_id, product_id }).del();
    }

    const updatedCart = await getCartDetails(user_id);

    res.json({
      message: "Cart updated successfully",
      cart: updatedCart,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const viewCart = async (req, res) => {
  const user_id = req.user.id;
  try {
    const cart = await getCartDetails(user_id);
    res.json({
      message: cart.length ? "Cart fetched successfully" : "Cart is empty",
      cart,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addToCart, removeFromCart, viewCart };
