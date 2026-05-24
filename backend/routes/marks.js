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

    // Teachers only see marks for subjects they teach or their homeroom students
    if (req.user.role === "teacher") {
      const Teacher = require("../models/Teacher");
      const Student = require("../models/Student");
      const Subject = require("../models/Subject");
      const teacher = await Teacher.findById(req.user.refId);
      if (teacher) {
        const teacherSubjects = await Subject.find({ teacherId: teacher._id });
        const teacherSubjectIds = teacherSubjects.map(s => s._id);

        const homeroomStudents = await Student.find({ grade: teacher.assignedGrade, section: teacher.assignedSection });
        const homeroomStudentIds = homeroomStudents.map(s => s._id);

        filter.$or = [
          { enteredBy: req.user._id },
          { subjectId: { $in: teacherSubjectIds } },
          { studentId: { $in: homeroomStudentIds } }
        ];
      }
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

    const effectiveMaxScore = maxScore ? Math.min(Number(maxScore), 100) : 100;
    if (score < 0 || score > effectiveMaxScore) {
      return res.status(400).json({ message: `Score (${score}) must be between 0 and ${effectiveMaxScore}` });
    }

    if (req.user.role === "teacher") {
      const Teacher = require("../models/Teacher");
      const Student = require("../models/Student");
      const Subject = require("../models/Subject");

      const teacher = await Teacher.findById(req.user.refId);
      const student = await Student.findById(studentId);
      const subject = await Subject.findById(subjectId);

      if (!teacher || !student || !subject) {
        return res.status(404).json({ message: "Invalid references provided" });
      }

      const isSubjectTeacher = subject.teacherId.toString() === teacher._id.toString();
      const isHomeroomTeacher = student.grade === teacher.assignedGrade && student.section === teacher.assignedSection;

      if (!isSubjectTeacher && !isHomeroomTeacher) {
        return res.status(403).json({ message: "Access denied. You are not authorized to enter marks for this student/subject." });
      }
    }

    let mark = await Mark.findOne({ studentId, subjectId, academicYear, semester, assessmentType });
    if (mark) {
      mark.score = score;
      mark.maxScore = maxScore;
      mark.remarks = remarks;
      mark.enteredBy = req.user._id;
    } else {
      mark = new Mark({
        studentId,
        subjectId,
        academicYear,
        semester,
        assessmentType,
        score,
        maxScore,
        remarks,
        enteredBy: req.user._id,
      });
    }
    await mark.save();

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
    console.error("Mark save error:", err);
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

module.exports = router;
