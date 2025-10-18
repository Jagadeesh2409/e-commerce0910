const express = require("express");
const router = express.Router();
const {
  initiatePayment,
  verifyPayment,
} = require("../controllers/paymentController");
const { auth } = require("../middleware/authMiddleware");
const Validator = require("express-joi-validation").createValidator({});
const {
  initiatePaymentSchema,
  verifyPaymentSchema,
} = require("../middleware/validator");

router.post(
  "/initiate",
  auth,
  Validator.body(initiatePaymentSchema),
  initiatePayment
);
router.post(
  "/verify",
  auth,
  Validator.body(verifyPaymentSchema),
  verifyPayment
);

module.exports = router;
