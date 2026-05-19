const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "teacher", "student"], required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
    recoveryEmail: { type: String, trim: true, lowercase: true },
    refId: { type: mongoose.Schema.Types.ObjectId, refPath: "role" },
    // Password reset fields
    resetPasswordToken: { type: String, default: undefined },
    resetPasswordExpires: { type: Date, default: undefined },
    // Profile Customization
    avatar: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },
    // Identity Verification
    verificationQuestions: [
      {
        question: { type: String },
        answer: { type: String }
      }
    ],
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
userSchema.index({ refId: 1 });
userSchema.index({ isDeleted: 1 });

module.exports = mongoose.model("User", userSchema);
