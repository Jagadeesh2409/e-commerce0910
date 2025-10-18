const express = require("express");
const router = express.Router();
const { generateInvoice } = require("../controllers/invoiceController");
const { auth } = require("../middleware/authMiddleware");

router.get("/:order_id", auth, generateInvoice);

module.exports = router;
