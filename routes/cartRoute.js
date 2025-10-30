const express = require("express");
const router = express.Router();
const Validator = require("express-joi-validation").createValidator({});

const {
  addToCart,
  removeFromCart,
  viewCart,
} = require("../controllers/cartController");

const { auth } = require("../middleware/authMiddleware");
const { addCartSchema, removeCartSchema } = require("../middleware/validator");

router.post("/", auth, Validator.body(addCartSchema), addToCart);
router.delete("/", auth, Validator.body(removeCartSchema), removeFromCart);
router.get("/", auth, viewCart);

module.exports = router;

