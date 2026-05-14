const express = require("express");
const Attendance = require("../models/Attendance");
const AuditLog = require("../models/AuditLog");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/attendance?studentId=&subjectId=&date=
router.get("/", protect, async (req, res) => {
  try {
    const filter = {};
    if (req.query.studentId) filter.studentId = req.query.studentId;
    if (req.query.subjectId) filter.subjectId = req.query.subjectId;
    if (req.query.date) filter.date = new Date(req.query.date);

    // Students only see their own
    if (req.user.role === "student") {
      filter.studentId = req.user.refId;
    }

    const records = await Attendance.find(filter)
      .populate("subjectId", "name code")
      .populate("studentId", "firstName lastName rollNumber")
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/attendance/bulk — record attendance for a class
router.post("/bulk", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const { records } = req.body;
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "Provide an array of attendance records" });
    }

    const results = [];
    for (const r of records) {
      const record = await Attendance.findOneAndUpdate(
        { studentId: r.studentId, subjectId: r.subjectId, date: new Date(r.date) },
        { status: r.status, recordedBy: req.user._id },
        { new: true, upsert: true, runValidators: true }
      );
      results.push(record);
    }

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      action: "RECORD_ATTENDANCE",
      entity: "Attendance",
      details: `Recorded attendance for ${results.length} students`,
      ipAddress: req.ip,
    });

    res.status(201).json({ message: `${results.length} records saved`, records: results });
  } catch (err) {
    res.status(400).json({ message: "Error recording attendance" });
  }
});

module.exports = router;
