const express = require("express");
const router = express.Router();
const {
  createProduct,
  deleteProductById,
  updateProductById,
  getAllProducts,
  getProductById,
} = require("../controllers/productController");

router.post("/", createProduct);
router.put("/:id", updateProductById);
router.delete("/:id", deleteProductById);
router.get("/:id", getProductById);
router.get("/:id", getAllProducts);

module.exports = router;
