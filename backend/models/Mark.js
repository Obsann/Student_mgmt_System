const mongoose = require("mongoose");

const markSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    academicYear: { type: String, required: true },
    semester: { type: Number, required: true, enum: [1, 2] },
    assessmentType: { type: String, enum: ["quiz", "midterm", "final", "assignment"], required: true },
    score: { type: Number, required: true, min: 0 },
    maxScore: { type: Number, required: true, default: 100 },
    remarks: { type: String, default: "" },
    enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Custom validator: score cannot exceed maxScore
markSchema.pre("save", function (next) {
  if (this.score > this.maxScore) {
    return next(new Error(`Score (${this.score}) cannot exceed max score (${this.maxScore})`));
  }
  next();
});

// Compound index to prevent duplicate marks
markSchema.index(
  { studentId: 1, subjectId: 1, assessmentType: 1, semester: 1, academicYear: 1 },
  { unique: true }
);

module.exports = mongoose.model("Mark", markSchema);
