const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const teachers = await User.find({ role: "teacher" }).select("username name -_id").lean();
  console.log("=== 16 TEACHER USERNAMES ===");
  teachers.forEach((t, i) => {
    console.log((i + 1) + ". " + t.username + "  (" + t.name + ")");
  });

  const totalStudents = await User.countDocuments({ role: "student" });
  console.log("\n=== STUDENT ACCOUNTS: " + totalStudents + " total ===");

  const sample = await User.find({ role: "student" }).select("username name -_id").limit(5).lean();
  console.log("Sample student usernames:");
  sample.forEach((s, i) => {
    console.log("  " + (i + 1) + ". " + s.username);
  });

  process.exit(0);
});
