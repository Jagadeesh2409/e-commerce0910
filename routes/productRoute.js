const express = require("express");
const router = express.Router();
const {
  createProduct,
  deleteProductById,
  updateProductById,
  getAllProducts,
  getProductById,
} = require("../controllers/productController");

const {bulkUpdate,bulkupload,getBulkData} = require('../controllers/importAndExportController')
const { adminAuth } = require("../middleware/authMiddleware");

const validator = require("express-joi-validation").createValidator({});
const { product } = require("../middleware/validator");
const upload = require('../middleware/upload')
// ✅ Middleware to restrict access only to "products" table
const checker = (req, res, next) => {
  req.params.table = "products"; // 👈 always set table as 'products'
  return next();
};

router.get("/getbulk",checker,getBulkData)
router.post("/", adminAuth, validator.body(product), createProduct);
router.put("/:id", adminAuth, updateProductById);
router.delete("/:id", adminAuth, deleteProductById);
router.get("/:id", adminAuth, getProductById);
router.get("/", adminAuth, getAllProducts);


router.post("/bulkupload", checker, upload.single("product"), bulkupload);
router.post("/bulkupdate", checker, upload.single("productupdate"), bulkUpdate);


module.exports = router;
