const express = require("express");
const Student = require("../models/Student");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const { protect, authorize } = require("../middleware/auth");
const { sendCredentialsEmail } = require("../utils/mailer");

const router = express.Router();

// ─── Helper: generate a unique username ───────────────────────────────────────
function generateUsername(firstName, lastName, suffix) {
  const base = `${firstName.toLowerCase().replace(/\s+/g, "")}.${lastName.toLowerCase().replace(/\s+/g, "")}`;
  return `${base}${suffix}`;
}

// ─── Helper: generate random password ────────────────────────────────────────
function generatePassword(length = 10) {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/students — list all, filter by grade/section, or role-scoped
// ─────────────────────────────────────────────────────────────────────────────
router.get("/", protect, async (req, res) => {
  try {
    const { grade, section, status } = req.query;
    const filter = {};
    if (grade) filter.grade = grade;
    if (section) filter.section = section;
    if (status) filter.status = status;           // ?status=pending for admin pending view

    // Teachers can only see their assigned class (and all statuses for enrollment review)
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

    const students = await Student.find(filter).sort({ status: -1, grade: 1, section: 1, rollNumber: 1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/students/:id
// ─────────────────────────────────────────────────────────────────────────────
router.get("/:id", protect, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Students can only view themselves
    if (req.user.role === "student" && String(req.user.refId) !== req.params.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    // Teachers can only view students in their assigned grade/section
    if (req.user.role === "teacher") {
      const Teacher = require("../models/Teacher");
      const teacher = await Teacher.findById(req.user.refId);
      if (teacher && (student.grade !== teacher.assignedGrade || student.section !== teacher.assignedSection)) {
        return res.status(403).json({ message: "Access denied. Student is not in your assigned class." });
      }
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/students — create (admin = active+credentials, teacher = pending)
// ─────────────────────────────────────────────────────────────────────────────
router.post("/", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";

    // Determine status based on role
    const studentData = {
      ...req.body,
      status: isAdmin ? "active" : "pending",
      addedBy: req.user._id,
    };

    const student = await Student.create(studentData);

    // If admin creates directly → also create user account with generated password
    if (isAdmin) {
      const username = generateUsername(req.body.firstName, req.body.lastName, student._id.toString().slice(-3));
      const password = generatePassword();
      await User.create({
        username,
        password,
        role: "student",
        name: `${req.body.firstName} ${req.body.lastName}`,
        email: req.body.personalEmail || `${username}@keraschool.et`,
        refId: student._id,
      });
    }

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      action: isAdmin ? "CREATE" : "ENROLL_REQUEST",
      entity: "Student",
      entityId: student._id.toString(),
      details: `${isAdmin ? "Created" : "Enrollment requested for"} student ${req.body.firstName} ${req.body.lastName}`,
      ipAddress: req.ip,
    });

    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ message: "Validation error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/students/:id/issue-credentials — Admin approves + emails credentials
// ─────────────────────────────────────────────────────────────────────────────
router.post("/:id/issue-credentials", protect, authorize("admin"), async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (student.status === "active") {
      return res.status(400).json({ message: "Credentials already issued for this student" });
    }

    const deliveryEmail = student.personalEmail || req.body.email;
    if (!deliveryEmail) {
      return res.status(400).json({ message: "Student has no personal email on record. Please add one first." });
    }

    // Generate credentials
    const username = generateUsername(student.firstName, student.lastName, student._id.toString().slice(-3));
    const password = generatePassword();

    // Check if user already exists (avoid duplicates)
    const existingUser = await User.findOne({ $or: [{ username }, { refId: student._id }] });
    if (existingUser) {
      return res.status(409).json({ message: "A user account already exists for this student." });
    }

    // Create user account
    await User.create({
      username,
      password,
      role: "student",
      name: `${student.firstName} ${student.lastName}`,
      email: deliveryEmail,
      refId: student._id,
    });

    // Mark student as active
    student.status = "active";
    student.personalEmail = deliveryEmail;
    student.credentialsIssuedAt = new Date();
    await student.save();

    // Send credentials email
    await sendCredentialsEmail({
      to: deliveryEmail,
      studentName: `${student.firstName} ${student.lastName}`,
      username,
      password,
      grade: student.grade,
      section: student.section,
    });

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      action: "ISSUE_CREDENTIALS",
      entity: "Student",
      entityId: student._id.toString(),
      details: `Issued credentials to ${student.firstName} ${student.lastName} → ${deliveryEmail}`,
      ipAddress: req.ip,
    });

    res.json({
      message: `Credentials issued and emailed to ${deliveryEmail}`,
      username,
      student,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/students/bulk — CSV bulk import (admin only, all active)
// ─────────────────────────────────────────────────────────────────────────────
router.post("/bulk", protect, authorize("admin"), async (req, res) => {
  try {
    const { students: studentList } = req.body;
    if (!Array.isArray(studentList) || studentList.length === 0) {
      return res.status(400).json({ message: "Provide an array of students" });
    }

    const created = [];
    for (const s of studentList) {
      const student = await Student.create({ ...s, status: "active" });
      const username = generateUsername(s.firstName, s.lastName, student._id.toString().slice(-3));
      const password = generatePassword();
      await User.create({
        username,
        password,
        role: "student",
        name: `${s.firstName} ${s.lastName}`,
        email: s.personalEmail || `${username}@keraschool.et`,
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
    res.status(400).json({ message: "Bulk import error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/students/:id
// ─────────────────────────────────────────────────────────────────────────────
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    // Whitelist allowed fields — prevent overwriting status, addedBy, etc.
    const allowed = ["firstName", "lastName", "age", "gender", "grade", "section", "rollNumber", "parentPhone", "address", "personalEmail"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const student = await Student.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
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
    res.status(400).json({ message: "Validation error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /api/students/:id
// ─────────────────────────────────────────────────────────────────────────────
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

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
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
