const express = require("express");
const Mark = require("../models/Mark");
const AuditLog = require("../models/AuditLog");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/marks — fetch all marks (admin/teacher) or filtered
router.get("/", protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.studentId) filter.studentId = req.query.studentId;
    if (req.query.subjectId) filter.subjectId = req.query.subjectId;
    if (req.query.assessmentType) filter.assessmentType = req.query.assessmentType;

    // Students can only see their own marks
    if (req.user.role === "student") {
      filter.studentId = req.user.refId;
    }

    const marks = await Mark.find(filter)
      .populate("subjectId", "name code grade")
      .sort({ createdAt: -1 });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/marks/:studentId — fetch marks for a specific student
router.get("/:studentId", protect, async (req, res) => {
  try {
    // Students can only view their own marks
    if (req.user.role === "student" && String(req.user.refId) !== req.params.studentId) {
      return res.status(403).json({ message: "Access denied. You can only view your own marks." });
    }

    const marks = await Mark.find({ studentId: req.params.studentId }).populate("subjectId");
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/marks
router.post("/", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const { studentId, subjectId, academicYear, semester, assessmentType, score, maxScore, remarks } = req.body;

    // Manual validation (pre-save hooks don't fire on findOneAndUpdate)
    const effectiveMaxScore = maxScore || 100;
    if (score < 0 || score > effectiveMaxScore) {
      return res.status(400).json({ message: `Score (${score}) must be between 0 and ${effectiveMaxScore}` });
    }

    // Use findOneAndUpdate with upsert to either create new or update existing mark
    const mark = await Mark.findOneAndUpdate(
      { studentId, subjectId, academicYear, semester, assessmentType },
      { score, maxScore, remarks, enteredBy: req.user._id },
      { new: true, upsert: true, runValidators: true }
    );

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      action: "ENTER_MARK",
      entity: "Mark",
      entityId: mark._id.toString(),
      details: `Entered/Updated mark ${score}/${maxScore || 100} for student ${studentId}`,
      ipAddress: req.ip,
    });

    res.status(201).json(mark);
  } catch (err) {
    res.status(400).json({ message: "Validation error" });
  }
});

module.exports = router;
