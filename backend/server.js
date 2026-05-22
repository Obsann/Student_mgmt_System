const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const compression = require("compression");
const mongoSanitize = require("express-mongo-sanitize");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const { auditMiddleware } = require("./middleware/auditMiddleware");

dotenv.config();

// ─── Environment Validation ──────────────────────────────────────────────────
const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"];
for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    console.error(`✗ FATAL: Missing required environment variable: ${key}`);
    process.exit(1);
  }
}
if (process.env.JWT_SECRET.length < 32) {
  console.error("✗ FATAL: JWT_SECRET must be at least 32 characters for security.");
  process.exit(1);
}

const app = express();

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL ? process.env.FRONTEND_URL.trim() : "http://localhost:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ],
  credentials: true
}));

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(compression({
  level: 6,
  threshold: 0
}));
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 200 : 500, // generous in dev for HMR/Strict Mode
  message: "Too many requests from this IP, please try again later."
});
app.use("/api", limiter);

app.use(express.json({ limit: "10mb" }));

// ─── Zero-Boilerplate Audit Middleware ──────────────────────────────────────
app.use(auditMiddleware);

// ─── Routes ─────────────────────────────────────────────────────────────────
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

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "SMS Backend API is running" });
});

// ─── Deployment Diagnostics (non-sensitive) ──────────────────────────────────
app.get("/api/health/env", (req, res) => {
  res.json({
    node: process.version,
    env: process.env.NODE_ENV || "development",
    cors: process.env.FRONTEND_URL || "http://localhost:5173",
    db: process.env.MONGO_URI ? "configured" : "MISSING",
    jwt: process.env.JWT_SECRET ? "configured" : "MISSING",
    smtp: process.env.SMTP_HOST ? "configured" : "not configured (console mode)",
  });
});

// ─── 404 Catch-All ──────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// ─── Global Error Handler (sanitize in production) ──────────────────────────
app.use((err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// ─── Sequential Startup: DB first, then listen ─────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✓ Server running on http://localhost:${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || "development"}`);
  });
});
