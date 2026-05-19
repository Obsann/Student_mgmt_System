const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/User");
const Student = require("./models/Student");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const grades = ["9", "10", "11", "12"];
  const sections = ["A", "B", "C", "D"];

  for (const grade of grades) {
    for (const section of sections) {
      const students = await Student.find({ grade, section }).limit(2).lean();
      const results = [];
      for (const s of students) {
        const user = await User.findOne({ refId: s._id }).select("username -_id").lean();
        results.push(user ? user.username : "no-user");
      }
      console.log("Grade " + grade + "-" + section + ": " + results.join("  |  "));
    }
  }

  process.exit(0);
});
