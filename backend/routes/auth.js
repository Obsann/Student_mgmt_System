const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const AuditLog = require("../models/AuditLog");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const { sendPasswordResetEmail, sendCredentialsEmail } = require("../utils/mailer");
const { upload, isConfigured } = require("../utils/cloudinary");

const router = express.Router();

function generatePassword(length = 10) {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// POST /api/auth/login
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    const user = await User.findOne({ username: trimmedUsername, isDeleted: { $ne: true } });
    if (!user || !(await user.comparePassword(trimmedPassword))) {
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
        avatar: user.avatar,
        coverPhoto: user.coverPhoto,
        recoveryEmail: user.recoveryEmail,
        verificationQuestions: user.verificationQuestions,
        phone: user.phone,
        address: user.address,
        bio: user.bio,
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

// POST /api/auth/register  — PUBLIC registration is disabled
router.post("/register", async (req, res) => {
  return res.status(403).json({ message: "Public registration is disabled. Please contact your teacher or the school admin to enroll." });
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
router.put("/profile", protect, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'coverPhoto', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, email, recoveryEmail, phone, address, bio, verificationQuestions } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (recoveryEmail !== undefined) updates.recoveryEmail = recoveryEmail;
    if (phone !== undefined) updates.phone = phone;
    if (address !== undefined) updates.address = address;
    if (bio !== undefined) updates.bio = bio;
    if (verificationQuestions) {
      try {
        updates.verificationQuestions = JSON.parse(verificationQuestions);
      } catch (e) {
        // If it's already an object/array, or just ignore if invalid
        updates.verificationQuestions = verificationQuestions;
      }
    }

    if (req.files) {
      if (req.files.avatar && req.files.avatar[0].path) {
        updates.avatar = req.files.avatar[0].path;
      }
      if (req.files.coverPhoto && req.files.coverPhoto[0].path) {
        updates.coverPhoto = req.files.coverPhoto[0].path;
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Sync avatar and other fields to refId if needed
    if (user.refId) {
      if (user.role === "student") {
        const Student = require("../models/Student");
        const studentUpdates = {};
        if (updates.avatar) studentUpdates.avatar = updates.avatar;
        if (updates.recoveryEmail) studentUpdates.personalEmail = updates.recoveryEmail;
        if (updates.address) {
          const student = await Student.findById(user.refId);
          if (student) {
            studentUpdates.address = {
              ...(student.address ? (typeof student.address.toObject === 'function' ? student.address.toObject() : student.address) : {}),
              kebele: updates.address
            };
          }
        }
        if (Object.keys(studentUpdates).length > 0) {
          await Student.findByIdAndUpdate(user.refId, studentUpdates);
        }
      } else if (user.role === "teacher") {
        const Teacher = require("../models/Teacher");
        const teacherUpdates = {};
        if (updates.avatar) teacherUpdates.avatar = updates.avatar;
        if (updates.phone) teacherUpdates.phone = updates.phone;
        if (updates.email) teacherUpdates.email = updates.email;
        if (Object.keys(teacherUpdates).length > 0) {
          await Teacher.findByIdAndUpdate(user.refId, teacherUpdates);
        }
      }
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/auth/verification-questions/:username — get questions for a user
router.get("/verification-questions/:username", async (req, res) => {
  try {
    const trimmedUsername = req.params.username.trim();
    const user = await User.findOne({ username: trimmedUsername });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.verificationQuestions || user.verificationQuestions.length === 0) {
      return res.status(400).json({ message: "No verification questions set for this user." });
    }
    // Only return the questions, not the answers
    const questions = user.verificationQuestions.map(q => q.question);
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/forgot-password — verify identity and send new password
router.post("/forgot-password", authLimiter, async (req, res) => {
  try {
    const { username, answers } = req.body;

    if (!username || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Username and answers are required" });
    }

    const trimmedUsername = username.trim();
    const user = await User.findOne({ username: trimmedUsername });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.email && !user.recoveryEmail) {
      return res.status(400).json({ message: "User has no email address configured to receive the password." });
    }

    const deliveryEmail = user.recoveryEmail || user.email;

    if (!user.verificationQuestions || user.verificationQuestions.length === 0) {
      return res.status(400).json({ message: "Identity verification is not set up for this account. Contact admin." });
    }

    if (answers.length !== user.verificationQuestions.length) {
      return res.status(400).json({ message: "Incorrect number of answers." });
    }

    // Check answers (case-insensitive)
    let isVerified = true;
    for (let i = 0; i < user.verificationQuestions.length; i++) {
      const expected = user.verificationQuestions[i].answer.toLowerCase().trim();
      const provided = answers[i].toLowerCase().trim();
      if (expected !== provided) {
        isVerified = false;
        break;
      }
    }

    if (!isVerified) {
      await AuditLog.create({
        userId: user._id,
        userName: user.name,
        action: "PASSWORD_RESET_FAILED",
        entity: "User",
        details: `Failed identity verification for ${user.username}`,
        ipAddress: req.ip,
      });
      return res.status(401).json({ message: "Identity verification failed. Incorrect answers." });
    }

    // Verified! Generate new password
    const newPassword = generatePassword();
    user.password = newPassword;
    await user.save();

    // Send the new password via email using the credentials template
    await sendCredentialsEmail({
      to: deliveryEmail,
      studentName: user.name,
      username: user.username,
      password: newPassword,
      grade: 'N/A',
      section: 'N/A',
    });

    await AuditLog.create({
      userId: user._id,
      userName: user.name,
      action: "PASSWORD_RESET_SUCCESS",
      entity: "User",
      entityId: user._id.toString(),
      details: `Password reset via identity verification for ${user.username}`,
      ipAddress: req.ip,
    });

    res.json({ message: "Identity verified. A new password has been sent to your email address." });
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

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN USER MANAGEMENT ROUTES
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/auth/admin/users — list all users (admin only)
router.get("/admin/users", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    const users = await User.find().select("-password").sort({ role: 1, name: 1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/auth/admin/user/:userId — admin update any user's credentials
router.put("/admin/user/:userId", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { name, email, username, password, recoveryEmail, verificationQuestions } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (username) updates.username = username;
    if (recoveryEmail !== undefined) updates.recoveryEmail = recoveryEmail;
    if (verificationQuestions) updates.verificationQuestions = verificationQuestions;

    if (password) {
      // Force-reset password: we need to use save() to trigger the bcrypt hash hook
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      user.password = password;
      Object.assign(user, updates);
      await user.save();

      await AuditLog.create({
        userId: req.user._id,
        userName: req.user.name,
        action: "ADMIN_UPDATE_USER",
        entity: "User",
        entityId: user._id.toString(),
        details: `Admin force-reset password and updated user ${user.username}`,
        ipAddress: req.ip,
      });

      return res.json({ message: "User updated with new password", user: await User.findById(user._id).select("-password") });
    }

    const user = await User.findByIdAndUpdate(req.params.userId, updates, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      action: "ADMIN_UPDATE_USER",
      entity: "User",
      entityId: user._id.toString(),
      details: `Admin updated user ${user.username}`,
      ipAddress: req.ip,
    });

    res.json({ message: "User updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

// POST /api/auth/admin/send-credentials/:userId — generate new password and send to user
router.post("/admin/send-credentials/:userId", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    let user = await User.findById(req.params.userId);
    if (!user) {
      user = await User.findOne({ refId: req.params.userId });
    }
    if (!user) return res.status(404).json({ message: "User not found" });

    const deliveryEmail = req.body.email || user.recoveryEmail || user.email;
    if (!deliveryEmail) {
      return res.status(400).json({ message: "No email address available. Please provide one." });
    }

    const newPassword = generatePassword();
    user.password = newPassword;
    await user.save();

    await sendCredentialsEmail({
      to: deliveryEmail,
      studentName: user.name,
      username: user.username,
      password: newPassword,
      grade: 'N/A',
      section: 'N/A',
    });

    await AuditLog.create({
      userId: req.user._id,
      userName: req.user.name,
      action: "ADMIN_SEND_CREDENTIALS",
      entity: "User",
      entityId: user._id.toString(),
      details: `Admin sent new credentials to ${user.username} via ${deliveryEmail}`,
      ipAddress: req.ip,
    });

    res.json({ message: `New credentials generated and sent to ${deliveryEmail}`, username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

module.exports = router;
