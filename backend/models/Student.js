const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    grade: { type: String, required: true },
    section: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    parentPhone: { type: String, required: true },
    address: { type: String, default: "" },
    enrolledDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
