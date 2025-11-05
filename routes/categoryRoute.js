const express = require("express");
const router = express.Router();

const validator = require("express-joi-validation").createValidator({});
const { category } = require("../middleware/validator");
const {
  addProductCategories,
  removeCategoriesById,
  listProductCategories,
} = require("../controllers/categoriesController");
const { adminAuth } = require("../middleware/authMiddleware");

router.post("/", adminAuth,addProductCategories);
router.delete("/:id", adminAuth, removeCategoriesById);
router.get("/", adminAuth, listProductCategories);

module.exports = router;
