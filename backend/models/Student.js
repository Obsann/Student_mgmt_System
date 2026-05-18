const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    // Primary Identity
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    faydaId: { type: String, required: true, unique: true, length: 12 }, // 12-digit string

    // Academic History
    grade8GPA: { type: Number, required: true },
    previousSchool: { type: String, required: true },
    nationalExamNumber: { type: String, required: true, unique: true },

    // Contact Info & Guardian
    address: {
      region: { type: String, required: true },
      zone: { type: String, required: true },
      kebele: { type: String, required: true },
      houseNo: { type: String, required: true },
    },
    guardianName: { type: String, required: true },
    guardianRelation: { type: String, required: true },
    parentPhone: { type: String, required: true },
    personalEmail: { type: String, default: "" },

    // Academic Metadata
    grade: { type: String, required: true }, // Current grade level (9-12)
    section: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["active", "withdrawn", "pending"],
      default: "active",
    },
    enrolledDate: { type: Date, default: Date.now },

    // Audit & Social
    avatar: { type: String, default: "" },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User ID of registrar/teacher
    credentialsIssuedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
