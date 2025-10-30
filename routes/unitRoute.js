const express = require("express");
const router = express.Router();
const {
  createUnit,
  getAllUnits,
  updateUnitById,
  getUnitById,
} = require("../controllers/unitController");

const { adminAuth } = require("../middleware/authMiddleware");

const validator = require("express-joi-validation").createValidator({});
const { unit } = require("../middleware/validator");

router.post("/", adminAuth, validator.body(unit), createUnit);
router.get("/",  getAllUnits);
router.get("/:id", getUnitById);
router.put("/:id", adminAuth, updateUnitById);

module.exports = router;
