const express = require("express");
const router = express.Router();

const {
  createAddress,
  deleteAddress,
  listAddress,
  updateAddress,
} = require("../controllers/addressController");
const validator = require("express-joi-validation").createValidator({});
const { address } = require("../middleware/validator");
const { auth } = require("../middleware/authMiddleware");

router.post("/", auth, validator.body(address), createAddress);
router.get("/", auth, listAddress);
router.put("/:id", auth, updateAddress);
router.delete("/:id", auth, deleteAddress);

module.exports = router;
