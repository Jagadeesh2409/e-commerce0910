const knex = require("../db/knexConfig");
const { v4: uuidv4 } = require("uuid");
const { getCartDetails } = require("../utils/cartUtil"); // your existing function

const checkoutOrder = async (req, res) => {
  const user_id = req.user.id;
  const { address_id, flat_discount = 0 } = req.body;

  try {
    const cartSummary = await getCartDetails(user_id);

    if (!cartSummary.products.length)
      return res.status(400).json({ message: "Your cart is empty" });

    if (cartSummary.grand_total < parseFloat(flat_discount)) {
    } else {
      const grandTotal =
        parseFloat(cartSummary.grand_total) - parseFloat(flat_discount);
    }

    const year = new Date().getFullYear();
    const invoice_no = `INV-${year}-${uuidv4().slice(0, 6).toUpperCase()}`;

    const [order_id] = await knex("orders").insert({
      user_id,
      invoice_no,
      quantity: cartSummary.products.reduce((sum, p) => sum + p.quantity, 0),
      shipping_address: address_id,
      discount: flat_discount,
      tax: cartSummary.total_tax,
      total_price: grandTotal.toFixed(2),
      status: "Pending",
      created_at: knex.fn.now(),
    });

    const finalItems = cartSummary.products.map((item) => ({
      ...item,
      order_id,
      created_at: knex.fn.now(),
    }));

    await knex("order_items").insert(finalItems);

    await knex("cart_items").where({ user_id }).del();

    res.json({
      message: "Order placed successfully",
      order: {
        order_id,
        invoice_no,
        subtotal: cartSummary.subtotal,
        flat_discount: flat_discount.toFixed(2),
        total_tax: cartSummary.total_tax,
        grand_total: grandTotal.toFixed(2),
        items: finalItems,
      },
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ message: "Checkout failed", error: error.message });
  }
};

module.exports = { checkoutOrder };
