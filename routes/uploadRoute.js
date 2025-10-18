const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

router.post("/profile", upload.single("profile"), (req, res) => {
  res.json({ success: true, file: req.file.path });
});

router.post("/media", upload.array("media", 5), (req, res) => {
  const files = req.files.map((f) => f.path);
  res.json({ success: true, files });
});

router.post("/product", upload.array("product", 5), (req, res) => {
  const files = req.files.map((f) => f.path);
  res.json({ success: true, files });
});

module.exports = router;
