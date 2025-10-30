const express = require("express");
const router = express.Router();
const {
  createProduct,
  deleteProductById,
  updateProductById,
  getAllProducts,
  getProductById,
} = require("../controllers/productController");
const { adminAuth,auth} = require("../middleware/authMiddleware");

const validator = require("express-joi-validation").createValidator({});
const { product } = require("../middleware/validator");

router.post("/", adminAuth, validator.body(product), createProduct);
router.put("/:id", adminAuth, updateProductById);
router.get("/:id", getProductById);
router.get("/", getAllProducts);

module.exports = router;
