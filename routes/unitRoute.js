const express = require("express");
const router = express.Router();
const {
  createUnit,
  getAllUnits,
  updateUnitById,
  getUnitById,
  deleteUnitById,
} = require("../controllers/unitController");

const { adminAuth } = require("../middleware/authMiddleware");

const validator = require("express-joi-validation").createValidator({});
const { unit } = require("../middleware/validator");

router.post("/", adminAuth, validator.body(unit), createUnit);
router.get("/", adminAuth, getAllUnits);
router.get("/:id", adminAuth, getUnitById);
router.put("/:id", adminAuth, updateUnitById);
router.delete("/:id", adminAuth, deleteUnitById);

module.exports = router;
