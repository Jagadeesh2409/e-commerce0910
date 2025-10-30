const express = require("express");
const router = express.Router();

const validator = require("express-joi-validation").createValidator({});
const { category } = require("../middleware/validator");
const {
  addProductCategories,
  removeCategoriesById,
  listProductCategories,
} = require("../controllers/categoriesController");
const { adminAuth,auth} = require("../middleware/authMiddleware");

router.post("/", adminAuth, validator.body(category), addProductCategories);
router.delete("/:id", adminAuth, removeCategoriesById);
router.get("/", listProductCategories);

module.exports = router;
