const express = require("express");
const router = express.Router();
const {
  createPincode,
  getAllPincodes,
  updatePincode,
} = require("../controllers/pincodeController");
const { pincode } = require("../middleware/validator");
const { adminAuth } = require("../middleware/authMiddleware");
const validator = require("express-joi-validation").createValidator({});

router.post("/", adminAuth, validator.body(pincode), createPincode);
router.get("/", adminAuth, getAllPincodes);
router.put("/:id", adminAuth, updatePincode);


module.exports = router;

