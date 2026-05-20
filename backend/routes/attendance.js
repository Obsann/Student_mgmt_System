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

    // Teachers only see attendance for subjects they teach or their homeroom students
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
          { recordedBy: req.user._id },
          { subjectId: { $in: teacherSubjectIds } },
          { studentId: { $in: homeroomStudentIds } }
        ];
      }
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

    if (req.user.role === "teacher") {
      const Teacher = require("../models/Teacher");
      const Student = require("../models/Student");
      const Subject = require("../models/Subject");

      const teacher = await Teacher.findById(req.user.refId);
      if (!teacher) return res.status(403).json({ message: "Teacher not found" });

      const studentIds = [...new Set(records.map(r => r.studentId))];
      const subjectIds = [...new Set(records.map(r => r.subjectId))];
      
      const students = await Student.find({ _id: { $in: studentIds } });
      const subjects = await Subject.find({ _id: { $in: subjectIds } });

      const studentMap = new Map(students.map(s => [s._id.toString(), s]));
      const subjectMap = new Map(subjects.map(s => [s._id.toString(), s]));

      for (const r of records) {
        const student = studentMap.get(r.studentId.toString());
        const subject = subjectMap.get(r.subjectId.toString());

        if (!student || !subject) {
          return res.status(404).json({ message: "Invalid student or subject reference in bulk request" });
        }

        const isSubjectTeacher = subject.teacherId && subject.teacherId.toString() === teacher._id.toString();
        const isHomeroomTeacher = student.grade === teacher.assignedGrade && student.section === teacher.assignedSection;

        if (!isSubjectTeacher && !isHomeroomTeacher) {
          return res.status(403).json({ message: "Access denied. You are not authorized to submit attendance for all included students/subjects." });
        }
      }
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
