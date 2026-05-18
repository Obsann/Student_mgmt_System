const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, required: true },
    qualification: { type: String, default: "" },
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
    assignedGrade: { type: String, required: true },
    assignedSection: { type: String, required: true },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
