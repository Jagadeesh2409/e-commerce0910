// controllers/deliveryController.js
const knex = require("../db/knexConfig");


const getOrderTracking = async (req, res) => {
  const { order_id } = req.params;
  const user_id = req.user.id;

  try {
    const order = await knex("orders")
      .where({ id: order_id, user_id })
      .select("id", "invoice_no", "status", "created_at", "updated_at")
      .first();

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({
      order_id: order.id,
      invoice_no: order.invoice_no,
      current_status: order.status,
      ordered_at: order.created_at,
      last_updated: order.updated_at,
    });
  } catch (error) {
    console.error("Get Order Tracking Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getOrderTracking };
