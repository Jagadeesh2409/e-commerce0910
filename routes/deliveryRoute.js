const express = require("express");
const router = express.Router();
const {
  
  getOrderTracking
} = require("../controllers/deliveryController");
const { adminAuth, auth } = require("../middleware/authMiddleware");

router.get("/track/:order_id", auth, getOrderTracking);

module.exports = router;
