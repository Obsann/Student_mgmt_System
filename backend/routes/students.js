const express = require("express");
const Student = require("../models/Student");
const User = require("../models/User");
const Settings = require("../models/Settings");
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
    const { grade, section, status, search } = req.query;
    const filter = { isDeleted: { $ne: true } };
    
    if (grade && grade !== "All") filter.grade = grade;
    if (section && section !== "All") filter.section = section;
    if (status && status !== "All") filter.status = status;

    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { faydaId: { $regex: search, $options: "i" } }
      ];
    }

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

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50; // default 50
    const skip = (page - 1) * limit;

    const total = await Student.countDocuments(filter);
    const students = await Student.find(filter)
      .sort({ status: -1, grade: 1, section: 1, rollNumber: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      data: students,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
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
// POST /api/students — create (Registrar/Admin only)
// ─────────────────────────────────────────────────────────────────────────────
router.post("/", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";
    const isTeacher = req.user.role === "teacher";

    // Registration window check — teachers can only register when window is open
    if (isTeacher) {
      const regSetting = await Settings.findOne({ key: "registrationOpen" });
      if (!regSetting || regSetting.value === false || regSetting.value === "false") {
        return res.status(403).json({ message: "Registration window is currently closed. Contact admin." });
      }
    }

    // 1. Uniqueness Checks
    const { faydaId, nationalExamNumber } = req.body;
    
    // If teacher, force their assigned grade/section
    if (isTeacher) {
      const Teacher = require("../models/Teacher");
      const teacher = await Teacher.findById(req.user.refId);
      if (teacher) {
        req.body.grade = teacher.assignedGrade;
        req.body.section = teacher.assignedSection;
      }
    }
    
    if (faydaId) {
      const existingFayda = await Student.findOne({ faydaId });
      if (existingFayda) return res.status(400).json({ message: "Fayda ID already exists." });
    }

    if (nationalExamNumber) {
      const existingExam = await Student.findOne({ nationalExamNumber });
      if (existingExam) return res.status(400).json({ message: "National Exam Number already exists." });
    }

    // Determine status based on role (Teacher now acts as Registrar)
    const canActivate = isAdmin || isTeacher;

    const studentData = {
      ...req.body,
      status: canActivate ? "active" : "pending",
      addedBy: req.user._id,
    };

    const student = await Student.create(studentData);

    // If admin/registrar/teacher creates directly → also create user account and send email
    if (canActivate) {
      const username = generateUsername(req.body.firstName, req.body.lastName, student._id.toString().slice(-3));
      const password = generatePassword();
      const email = req.body.personalEmail || `${username}@keraschool.et`;

      try {
        await User.create({
          username,
          password,
          role: "student",
          name: `${req.body.firstName} ${req.body.lastName}`,
          email,
          refId: student._id,
          verificationQuestions: [
            { question: "What is your roll number?", answer: student.rollNumber || "" },
            { question: "What is your guardian's name?", answer: req.body.guardianName || "" }
          ],
        });

        // Send the email
        await sendCredentialsEmail({
          to: email,
          studentName: `${req.body.firstName} ${req.body.lastName}`,
          username,
          password,
          grade: student.grade,
          section: student.section,
        });
      } catch (userErr) {
        if (userErr.code === 11000) {
          // If user creation fails, we still created the student record, but no account.
          // We should probably delete the student record or inform the user.
          await Student.findByIdAndDelete(student._id);
          return res.status(400).json({ message: "A user with this email already exists." });
        }
        throw userErr;
      }
    }

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      action: canActivate ? "CREATE" : "ENROLL_REQUEST",
      entity: "Student",
      entityId: student._id.toString(),
      details: `${canActivate ? "Created" : "Enrollment requested for"} student ${req.body.firstName} ${req.body.lastName}`,
      ipAddress: req.ip,
    });

    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message || "Validation error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/students/:id/issue-credentials — Admin/Teacher approves + emails credentials
// ─────────────────────────────────────────────────────────────────────────────
router.post("/:id/issue-credentials", protect, authorize("admin", "teacher"), async (req, res) => {
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
    const errors = [];

    for (let i = 0; i < studentList.length; i++) {
      const s = studentList[i];
      try {
        // Validate required fields
        if (!s.firstName || !s.lastName || !s.faydaId || !s.grade || !s.section) {
          errors.push({ row: i + 1, message: `Missing required fields (firstName, lastName, faydaId, grade, section)` });
          continue;
        }
        
        // Check for duplicate faydaId
        const existingFayda = await Student.findOne({ faydaId: s.faydaId });
        if (existingFayda) {
          errors.push({ row: i + 1, message: `Fayda ID ${s.faydaId} already exists` });
          continue;
        }

        const student = await Student.create({ ...s, status: "active", addedBy: req.user._id });
        const username = generateUsername(s.firstName, s.lastName, student._id.toString().slice(-3));
        const password = generatePassword();
        await User.create({
          username,
          password,
          role: "student",
          name: `${s.firstName} ${s.lastName}`,
          email: s.personalEmail || `${username}@keraschool.et`,
          refId: student._id,
          verificationQuestions: [
            { question: "What is your roll number?", answer: s.rollNumber || "" },
            { question: "What is your guardian's name?", answer: s.guardianName || "" }
          ],
        });
        created.push(student);
      } catch (rowErr) {
        errors.push({ row: i + 1, message: rowErr.message || "Unknown error" });
      }
    }

    if (created.length > 0) {
      await AuditLog.create({
        userId: req.user._id,
        userName: req.user.name,
        action: "BULK_CREATE",
        entity: "Student",
        details: `Bulk imported ${created.length} students (${errors.length} errors)`,
        ipAddress: req.ip,
      });
    }

    if (created.length === 0 && errors.length > 0) {
      return res.status(400).json({ message: `All ${errors.length} rows failed`, errors });
    }

    res.status(201).json({ message: `${created.length} students imported${errors.length > 0 ? `, ${errors.length} rows had errors` : ''}`, students: created, errors });
  } catch (err) {
    res.status(400).json({ message: err.message || "Bulk import error" });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/students/:id
// ─────────────────────────────────────────────────────────────────────────────
router.put("/:id", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const studentToUpdate = await Student.findById(req.params.id);
    if (!studentToUpdate) return res.status(404).json({ message: "Student not found" });

    if (req.user.role === "teacher") {
      const Teacher = require("../models/Teacher");
      const teacher = await Teacher.findById(req.user.refId);
      if (!teacher || studentToUpdate.grade !== teacher.assignedGrade || studentToUpdate.section !== teacher.assignedSection) {
        return res.status(403).json({ message: "Access denied. Student is not in your assigned class." });
      }
    }

    // Whitelist allowed fields
    const allowed = [
      "firstName", "middleName", "lastName", "dateOfBirth", "gender", 
      "faydaId", "grade8GPA", "previousSchool", "nationalExamNumber",
      "address", "guardianName", "guardianRelation", "parentPhone", 
      "personalEmail", "grade", "section", "rollNumber", "status"
    ];
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
router.delete("/:id", protect, authorize("admin", "teacher"), async (req, res) => {
  try {
    const studentToDelete = await Student.findById(req.params.id);
    if (!studentToDelete) return res.status(404).json({ message: "Student not found" });

    if (req.user.role === "teacher") {
      const Teacher = require("../models/Teacher");
      const teacher = await Teacher.findById(req.user.refId);
      if (!teacher || studentToDelete.grade !== teacher.assignedGrade || studentToDelete.section !== teacher.assignedSection) {
        return res.status(403).json({ message: "Access denied. Student is not in your assigned class." });
      }
    }

    const student = await Student.findByIdAndUpdate(req.params.id, { isDeleted: true, status: 'withdrawn' });
    if (!student) return res.status(404).json({ message: "Student not found" });

    await User.updateOne({ refId: student._id, role: "student" }, { isDeleted: true });

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
