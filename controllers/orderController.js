const knex = require("../db/knexConfig");

const updateOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body;
  const validStatuses = [
    "Pending",
    "Paid",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    const order = await knex("orders").where({ id: order_id }).first();
    if (!order) return res.status(404).json({ message: "Order not found" });

    await knex("orders").where({ id: order_id }).update({
      status,
      updated_at: knex.fn.now(),
    });

    res.json({ message: `Order status updated to ${status}` });
  } catch (err) {
    console.error("Update Order Status Error:", err);
    res.status(500).json({ error: err.message });
  }
};

const markDelivered = async (req, res) => {
  const user_id = req.user.id;
  const { order_id } = req.params;

  try {
    const order = await knex("orders").where({ id: order_id, user_id }).first();

    if (!order) return res.status(404).json({ message: "Order not found" });

    await knex("orders").where({ id: order_id }).update({
      status: "Delivered",
      updated_at: knex.fn.now(),
    });

    res.json({ message: "Order marked as delivered" });
  } catch (err) {
    console.error("Mark Delivered Error:", err);
    res.status(500).json({ error: err.message });
  }
};

const getOrderHistory = async (req, res) => {
  const user_id = req.user.id;

  try {
    const orders = await knex("orders as o")
      .leftJoin("order_items as i", "o.id", "i.order_id")
      .where("o.user_id", user_id)
      .select(
        "o.id as order_id",
        "o.invoice_no",
        "o.status",
        "o.total_price",
        "o.created_at",
        "i.product_id",
        "i.name",
        "i.quantity",
        "i.price",
        "i.discount",
        "i.tax",
        "i.total_price as item_total"
      );

    if (!orders.length)
      return res.json({ message: "No orders found", orders: [] });

    const orderMap = {};
    orders.forEach((item) => {
      if (!orderMap[item.order_id]) {
        orderMap[item.order_id] = {
          order_id: item.order_id,
          invoice_no: item.invoice_no,
          status: item.status,
          total_price: item.total_price,
          created_at: item.created_at,
          items: [],
        };
      }
      if (item.product_id) {
        orderMap[item.order_id].items.push({
          product_id: item.product_id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          tax: item.tax,
          total_price: item.item_total,
        });
      }
    });

    res.json({ orders: Object.values(orderMap) });
  } catch (err) {
    console.error("Get Order History Error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { updateOrderStatus, markDelivered, getOrderHistory };
