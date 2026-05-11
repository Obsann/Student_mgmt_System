const express = require("express");
const Subject = require("../models/Subject");
const AuditLog = require("../models/AuditLog");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/subjects
router.get("/", protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.grade) filter.grade = req.query.grade;
    if (req.query.teacherId) filter.teacherId = req.query.teacherId;

    const subjects = await Subject.find(filter).populate("teacherId", "name email");
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// PUT /api/subjects/:id
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json(subject);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// DELETE /api/subjects/:id
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json({ message: "Subject deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
