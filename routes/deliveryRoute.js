const express = require("express");
const router = express.Router();
const {
  updateOrderStatus,
  getOrderTracking,
} = require("../controllers/deliveryController");
const { adminAuth, auth } = require("../middleware/authMiddleware");

router.put("/update-status", adminAuth, updateOrderStatus);
router.get("/track/:order_id", auth, getOrderTracking);

module.exports = router;
