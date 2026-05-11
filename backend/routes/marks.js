const express = require("express");
const Mark = require("../models/Mark");
const AuditLog = require("../models/AuditLog");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/marks/:studentId
router.get("/:studentId", protect, async (req, res) => {
  try {
    const marks = await Mark.find({ studentId: req.params.studentId }).populate("subjectId");
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/marks
router.post("/", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const { studentId, subjectId, academicYear, semester, assessmentType, score, maxScore, remarks } = req.body;

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
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

module.exports = router;
