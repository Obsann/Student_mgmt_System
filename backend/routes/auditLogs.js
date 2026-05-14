const express = require("express");
const AuditLog = require("../models/AuditLog");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/audit-logs — admin only
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const { limit = 50, page = 1, action, entity } = req.query;
    const filter = {};
    if (action) filter.action = action;
    if (entity) filter.entity = entity;

    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await AuditLog.countDocuments(filter);

    res.json({ logs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
