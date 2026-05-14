const express = require("express");
const Settings = require("../models/Settings");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/settings
router.get("/", protect, async (req, res) => {
  try {
    const settings = await Settings.find();
    const obj = {};
    settings.forEach((s) => { obj[s.key] = s.value; });
    res.json(obj);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/settings/:key — admin only
router.put("/:key", protect, authorize("admin"), async (req, res) => {
  try {
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value: req.body.value },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(400).json({ message: "Error updating setting" });
  }
});

module.exports = router;
