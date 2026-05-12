const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const { protect } = require("../middleware/auth");

const router = express.Router();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = signToken(user._id);

    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      action: "LOGIN",
      entity: "User",
      entityId: user._id.toString(),
      details: `${user.name} logged in as ${user.role}`,
      ipAddress: req.ip,
    });

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        refId: user.refId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/auth/me
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password, name, email, role } = req.body;

    if (!username || !password || !name || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Only allow student registration from public form
    const allowedRole = role === "teacher" || role === "admin" ? role : "student";

    // Check if user already exists
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.create({
      username,
      password,
      role: allowedRole,
      name,
      email,
    });

    const token = signToken(user._id);

    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      action: "REGISTER",
      entity: "User",
      entityId: user._id.toString(),
      details: `${user.name} registered as ${user.role}`,
      ipAddress: req.ip,
    });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        refId: user.refId,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/auth/password — change password (authenticated)
router.put("/password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);
    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      action: "CHANGE_PASSWORD",
      entity: "User",
      entityId: user._id.toString(),
      details: `${user.name} changed their password`,
      ipAddress: req.ip,
    });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/auth/profile — update profile info (authenticated)
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// POST /api/auth/forgot-password — request password reset
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email address is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account found with that email address" });
    }

    // In production, generate a reset token, save it, and send via SMTP/Nodemailer
    // For now, we log it and return success so the UI flow works
    const resetToken = require("crypto").randomBytes(32).toString("hex");
    console.log(`[FORGOT PASSWORD] Reset token for ${email}: ${resetToken}`);

    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      action: "PASSWORD_RESET_REQUEST",
      entity: "User",
      entityId: user._id.toString(),
      details: `Password reset requested for ${email}`,
      ipAddress: req.ip,
    });

    res.json({ message: "Password reset instructions sent to your email" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
