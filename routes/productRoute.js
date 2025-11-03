const express = require("express");
const router = express.Router();
const {
  createProduct,
  deleteProductById,
  updateProductById,
  getAllProducts,
  getProductById,
  getBulkData,
  bulkupload,
  bulkUpdate
} = require("../controllers/productController");
const { adminAuth } = require("../middleware/authMiddleware");

const validator = require("express-joi-validation").createValidator({});
const { product } = require("../middleware/validator");
const upload = require('../middleware/upload')

router.get("/getallproduct",getBulkData)
router.post("/", adminAuth, validator.body(product), createProduct);
router.put("/:id", adminAuth, updateProductById);
router.delete("/:id", adminAuth, deleteProductById);
router.get("/:id", adminAuth, getProductById);
router.get("/", adminAuth, getAllProducts);
router.post("/bulkupload",upload.single("product"),bulkupload)
router.post("/bulkupdate",upload.single("product"),bulkUpdate)


module.exports = router;
