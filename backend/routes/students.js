const express = require("express");
const Student = require("../models/Student");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/students — list all or filter by grade/section
router.get("/", protect, async (req, res) => {
  try {
    const { grade, section } = req.query;
    const filter = {};
    if (grade) filter.grade = grade;
    if (section) filter.section = section;

    // Teachers can only see their assigned class
    if (req.user.role === "teacher") {
      const Teacher = require("../models/Teacher");
      const teacher = await Teacher.findById(req.user.refId);
      if (teacher) {
        filter.grade = teacher.assignedGrade;
        filter.section = teacher.assignedSection;
      }
    }

    // Students can only see themselves
    if (req.user.role === "student") {
      const student = await Student.findById(req.user.refId);
      return res.json([student]);
    }

    const students = await Student.find(filter).sort({ grade: 1, section: 1, rollNumber: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/students/:id
router.get("/:id", protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/students — create one
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const student = await Student.create(req.body);

    // Also create a user account for the student
    const username = `${req.body.firstName.toLowerCase()}.${req.body.lastName.toLowerCase()}${student._id.toString().slice(-3)}`;
    await User.create({
      username,
      password: "student123",
      role: "student",
      name: `${req.body.firstName} ${req.body.lastName}`,
      email: `${username}@keraschool.et`,
      refId: student._id,
    });

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      action: "CREATE",
      entity: "Student",
      entityId: student._id.toString(),
      details: `Created student ${req.body.firstName} ${req.body.lastName}`,
      ipAddress: req.ip,
    });

    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// POST /api/students/bulk — CSV bulk import
router.post("/bulk", protect, authorize("admin"), async (req, res) => {
  try {
    const { students: studentList } = req.body;
    if (!Array.isArray(studentList) || studentList.length === 0) {
      return res.status(400).json({ message: "Provide an array of students" });
    }

    const created = [];
    for (const s of studentList) {
      const student = await Student.create(s);
      const username = `${s.firstName.toLowerCase()}.${s.lastName.toLowerCase()}${student._id.toString().slice(-3)}`;
      await User.create({
        username,
        password: "student123",
        role: "student",
        name: `${s.firstName} ${s.lastName}`,
        email: `${username}@keraschool.et`,
        refId: student._id,
      });
      created.push(student);
    }

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      action: "BULK_CREATE",
      entity: "Student",
      details: `Bulk imported ${created.length} students`,
      ipAddress: req.ip,
    });

    res.status(201).json({ message: `${created.length} students imported`, students: created });
  } catch (err) {
    res.status(400).json({ message: "Bulk import error", error: err.message });
  }
});

// PUT /api/students/:id
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ message: "Student not found" });

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      action: "UPDATE",
      entity: "Student",
      entityId: student._id.toString(),
      details: `Updated student ${student.firstName} ${student.lastName}`,
      ipAddress: req.ip,
    });

    res.json(student);
  } catch (err) {
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// DELETE /api/students/:id
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Remove user account too
    await User.deleteOne({ refId: student._id, role: "student" });

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      action: "DELETE",
      entity: "Student",
      entityId: student._id.toString(),
      details: `Deleted student ${student.firstName} ${student.lastName}`,
      ipAddress: req.ip,
    });

    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
