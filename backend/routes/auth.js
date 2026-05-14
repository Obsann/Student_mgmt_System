const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const { protect } = require("../middleware/auth");
const { sendPasswordResetEmail } = require("../utils/mailer");

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
    res.status(500).json({ message: "Server error" });
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

// POST /api/auth/register  — PUBLIC registration is ALWAYS student role
router.post("/register", async (req, res) => {
  try {
    const { username, password, name, email } = req.body;

    if (!username || !password || !name || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address format" });
    }

    // Check if user already exists
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return res.status(409).json({ message: "Username or email already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // SECURITY: Public registration is ALWAYS "student" — admin/teacher accounts
    // can ONLY be created by authenticated admins via the dashboard.
    const user = await User.create({
      username,
      password,
      role: "student",
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
      details: `${user.name} registered as student`,
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
    res.status(500).json({ message: "Registration failed. Please try again." });
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
    res.status(500).json({ message: "Server error" });
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
    res.status(500).json({ message: "Server error" });
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
      // Return success even if user not found (prevents user enumeration)
      return res.json({ message: "If an account with that email exists, reset instructions have been sent." });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Store hashed token + expiry in the user document
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Send the reset email (uses dev-mode logging if SMTP not configured)
    await sendPasswordResetEmail({
      to: email,
      name: user.name,
      token: resetToken, // Send the UNHASHED token — user submits it, we hash to compare
    });

    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      action: "PASSWORD_RESET_REQUEST",
      entity: "User",
      entityId: user._id.toString(),
      details: `Password reset requested for ${email}`,
      ipAddress: req.ip,
    });

    res.json({ message: "If an account with that email exists, reset instructions have been sent." });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

// POST /api/auth/reset-password — consume reset token and set new password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Hash the incoming token and look up the user
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Set new password and clear token
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      action: "PASSWORD_RESET_COMPLETE",
      entity: "User",
      entityId: user._id.toString(),
      details: `Password reset completed for ${user.email}`,
      ipAddress: req.ip,
    });

    res.json({ message: "Password has been reset successfully. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;
