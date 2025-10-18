const express = require("express");
const router = express.Router();
const { checkoutOrder } = require("../controllers/checkoutController");
const { auth } = require("../middleware/authMiddleware");

const Validator = require("express-joi-validation").createValidator({});

const { checkoutSchema } = require("../middleware/validator");

router.post("/", auth, Validator.body(checkoutSchema), checkoutOrder);

module.exports = router;
