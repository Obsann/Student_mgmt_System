const express = require("express");
const Teacher = require("../models/Teacher");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const { protect, authorize } = require("../middleware/auth");
const { sendCredentialsEmail } = require("../utils/mailer");

const router = express.Router();

// Generate random password (matches student route helper)
function generatePassword(length = 10) {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// GET /api/teachers
router.get("/", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const skip = (page - 1) * limit;
    
    const filter = { isDeleted: { $ne: true } };

    const { department, status, search } = req.query;
    if (department && department !== "All") filter.department = department;
    if (status && status !== "All") filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    const total = await Teacher.countDocuments(filter);
    const teachers = await Teacher.find(filter)
      .populate("subjects")
      .skip(skip)
      .limit(limit);

    res.json({
      data: teachers,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/teachers
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);

    const username = req.body.email.split("@")[0];
    const password = generatePassword();
    await User.create({
      username,
      password,
      role: "teacher",
      name: req.body.name,
      email: req.body.email,
      refId: teacher._id,
      verificationQuestions: [
        { question: "What grade are you assigned to?", answer: teacher.assignedGrade || "" },
        { question: "What is your phone number?", answer: req.body.phone || "" }
      ],
    });

    // Send credentials email to teacher
    try {
      await sendCredentialsEmail({
        to: req.body.email,
        studentName: req.body.name,
        username,
        password,
        grade: teacher.assignedGrade,
        section: teacher.assignedSection,
      });
    } catch (emailErr) {
      console.log(`[EMAIL ERROR] Could not send credentials to ${req.body.email}:`, emailErr.message);
    }

    console.log(`[TEACHER CREATED] Username: ${username}, Password: ${password}`);

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      action: "CREATE",
      entity: "Teacher",
      entityId: teacher._id.toString(),
      details: `Created teacher ${teacher.name}`,
    });

    res.status(201).json(teacher);
  } catch (err) {
    res.status(400).json({ message: err.message || "Validation error" });
  }
});

// PUT /api/teachers/:id
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    // Whitelist allowed fields
    const allowed = ["name", "email", "phone", "qualification", "assignedGrade", "assignedSection", "department", "experience", "status"];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const teacher = await Teacher.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    // If email changed, sync to User record
    if (updates.email) {
      await User.findOneAndUpdate({ refId: teacher._id, role: "teacher" }, { email: updates.email });
    }
    if (updates.name) {
      await User.findOneAndUpdate({ refId: teacher._id, role: "teacher" }, { name: updates.name });
    }

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      action: "UPDATE",
      entity: "Teacher",
      entityId: teacher._id.toString(),
      details: `Updated teacher ${teacher.name}`,
    });

    res.json(teacher);
  } catch (err) {
    res.status(400).json({ message: err.message || "Validation error" });
  }
});

// DELETE /api/teachers/:id
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, { isDeleted: true, status: 'Inactive' });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    await User.updateOne({ refId: teacher._id, role: "teacher" }, { isDeleted: true });

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      action: "DELETE",
      entity: "Teacher",
      entityId: teacher._id.toString(),
      details: `Deleted teacher ${teacher.name}`,
    });

    res.json({ message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
