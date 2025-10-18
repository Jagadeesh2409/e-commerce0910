const express = require("express");
const router = express.Router();
const {
  updateOrderStatus,
  markDelivered,
  getOrderHistory,
} = require("../controllers/orderController");
const { auth, adminAuth } = require("../middleware/authMiddleware");
const Validator = require("express-joi-validation").createValidator({});
const { updateOrderStatusSchema } = require("../middleware/validator");

router.put(
  "/:order_id/status",
  adminAuth,
  Validator.body(updateOrderStatusSchema),
  updateOrderStatus
);
router.put("/:order_id/delivered", auth, markDelivered);
router.get("/history", auth, getOrderHistory);

module.exports = router;
