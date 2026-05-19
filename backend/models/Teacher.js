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
    department: { type: String, default: "General" },
    experience: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "On Leave", "Inactive"], default: "Active" },
    avatar: { type: String, default: "" },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

teacherSchema.index({ email: 1 });
teacherSchema.index({ assignedGrade: 1, assignedSection: 1 });
teacherSchema.index({ department: 1 });
teacherSchema.index({ isDeleted: 1 });

module.exports = mongoose.model("Teacher", teacherSchema);
