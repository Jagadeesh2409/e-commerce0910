const express = require("express");
const router = express.Router();
const { generateInvoice } = require("../controllers/invoiceController");
const { auth, adminAuth } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const { getBulkData } = require("../controllers/importAndExportController");

const checker = async(req,res,next) => {
    req.params.table = "orders"
    next()
}

router.get("/getbulkdata",adminAuth,checker,getBulkData)
router.get("/:order_id", auth, generateInvoice);


module.exports = router;
