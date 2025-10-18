const knex = require("../db/knexConfig");
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const initiatePayment = async (req, res) => {
  const { order_id, payment_method } = req.body;
  const user_id = req.user.id;

  try {
    const order = await knex("orders").where({ id: order_id, user_id }).first();
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (payment_method === "Cash on Delivery") {
      await knex("orders").where({ id: order_id }).update({
        payment_method,
        payment_status: "Pending",
      });

      return res.json({
        message: "Order placed with Cash on Delivery",
        order_id,
        payment_method,
        payment_status: "Pending",
      });
    }

    const options = {
      amount: Math.round(order.total_price * 100),
      currency: "INR",
      receipt: `order_rcptid_${order_id}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Store transaction ID (Razorpay order id)
    await knex("orders").where({ id: order_id }).update({
      transaction_id: razorpayOrder.id,
      payment_method,
      payment_status: "Pending",
    });

    res.json({
      message: "Payment initiated successfully",
      order_id,
      razorpay_order_id: razorpayOrder.id,
      amount: order.total_price,
      currency: "INR",
    });
  } catch (error) {
    console.error("Initiate Payment Error:", error);
    res.status(500).json({ error: error.message });
  }
};

const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  try {
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      await knex("orders")
        .where({ transaction_id: razorpay_order_id })
        .update({ payment_status: "Failed" });

      return res.status(400).json({ message: "Payment verification failed" });
    }

    await knex("orders").where({ transaction_id: razorpay_order_id }).update({
      payment_status: "Completed",
      status: "Paid",
      payment_date: knex.fn.now(),
    });

    res.json({ message: "Payment successful", razorpay_payment_id });
  } catch (error) {
    console.error("Verify Payment Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { initiatePayment, verifyPayment };
