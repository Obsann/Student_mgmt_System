const express = require("express");
const Teacher = require("../models/Teacher");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// GET /api/teachers
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const teachers = await Teacher.find().populate("subjects");
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/teachers
router.post("/", protect, authorize("admin"), async (req, res) => {
  try {
    const teacher = await Teacher.create(req.body);

    const username = req.body.email.split("@")[0];
    await User.create({
      username,
      password: "teacher123",
      role: "teacher",
      name: req.body.name,
      email: req.body.email,
      refId: teacher._id,
    });

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
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// PUT /api/teachers/:id
router.put("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

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
    res.status(400).json({ message: "Validation error", error: err.message });
  }
});

// DELETE /api/teachers/:id
router.delete("/:id", protect, authorize("admin"), async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    await User.deleteOne({ refId: teacher._id, role: "teacher" });

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
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
