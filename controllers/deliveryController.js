// controllers/deliveryController.js
const knex = require("../db/knexConfig");

// 🧭 Update Order Status (Admin or Delivery Staff)
const updateOrderStatus = async (req, res) => {
  const { order_id, status } = req.body;
  const validStatuses = [
    "Pending",
    "Paid",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  try {
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const exist = await knex("orders").where({ id: order_id }).first();
    if (!exist) return res.status(404).json({ message: "Order not found" });

    await knex("orders").where({ id: order_id }).update({
      status,
      updated_at: knex.fn.now(),
    });

    res.json({ message: `Order status updated to ${status}` });
  } catch (error) {
    console.error("Update Order Status Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 👀 Get Delivery/Tracking Status (Customer)
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

module.exports = { updateOrderStatus, getOrderTracking };
