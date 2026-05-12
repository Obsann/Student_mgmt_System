const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use("/api", limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

app.use(express.json({ limit: "10mb" }));

// Routes
const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const teacherRoutes = require("./routes/teachers");
const subjectRoutes = require("./routes/subjects");
const markRoutes = require("./routes/marks");
const attendanceRoutes = require("./routes/attendance");
const auditLogRoutes = require("./routes/auditLogs");
const settingsRoutes = require("./routes/settings");

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SMS Backend API is running" });
});

// Database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✓ Connected to MongoDB"))
  .catch((err) => console.error("✗ MongoDB connection error:", err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
});
