const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true },
    grade: { type: String, required: true },
    sections: [{ type: String }], // Array of sections (e.g., ["A", "B", "C"])
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

subjectSchema.index({ code: 1, grade: 1 });
subjectSchema.index({ teacherId: 1 });
subjectSchema.index({ isDeleted: 1 });

module.exports = mongoose.model("Subject", subjectSchema);
