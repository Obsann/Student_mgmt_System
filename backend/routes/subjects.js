const express = require("express");
const Subject = require("../models/Subject");
const AuditLog = require("../models/AuditLog");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/subjects
router.get("/", protect, async (req, res) => {
  try {
    const filter = { isDeleted: { $ne: true } };
    if (req.query.grade) filter.grade = req.query.grade;
    if (req.query.teacherId) filter.teacherId = req.query.teacherId;

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;

    const total = await Subject.countDocuments(filter);
    const subjects = await Subject.find(filter)
      .populate("teacherId", "name email")
      .skip(skip)
      .limit(limit);

    res.json({
      data: subjects,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/subjects
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const subject = await Subject.create(req.body);

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      action: "CREATE",
      entity: "Subject",
      entityId: subject._id.toString(),
      details: `Created subject ${subject.name} (${subject.code}) for grade ${subject.grade}`,
    });

    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ message: "Validation error" });
  }
});

// PUT /api/subjects/:id
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    // Whitelist allowed fields
    const allowed = ["name", "code", "grade", "teacherId"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const subject = await Subject.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (err) {
    res.status(400).json({ message: "Validation error" });
  }
});

// DELETE /api/subjects/:id
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, { isDeleted: true });
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json({ message: "Subject deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
