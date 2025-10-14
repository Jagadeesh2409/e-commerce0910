const express = require("express");
const router = express.Router();
const Validator = require("express-joi-validation").createValidator({});

const {
  addCart,
  deleteCart,
  listCart,
} = require("../controllers/cartController");

const { auth } = require("../middleware/authMiddleware");
const { cart } = require("../middleware/validator");

router.post("/", auth, Validator.body(cart), addCart);
router.delete("/:id", auth, deleteCart);
router.get("/", auth, listCart);

module.exports = router;
