const mongoose = require("mongoose");
require("dotenv").config();
const Student = require("./models/Student");
const Subject = require("./models/Subject");
const Teacher = require("./models/Teacher");
const User = require("./models/User");
const Mark = require("./models/Mark");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  try {
    // Clear existing marks
    await Mark.deleteMany({});
    console.log("Cleared existing marks.");

    const students = await Student.find({ isDeleted: false });
    console.log(`Found ${students.length} students.`);

    const subjects = await Subject.find({ isDeleted: false });
    const teacherUsers = {};
    for (const sub of subjects) {
      if (sub.teacherId && !teacherUsers[sub.teacherId]) {
        const user = await User.findOne({ refId: sub.teacherId, role: "teacher" });
        if (user) {
          teacherUsers[sub.teacherId] = user._id;
        }
      }
    }

    let marksToInsert = [];

    for (const student of students) {
      // Find subjects for this student's grade and section
      const studentSubjects = subjects.filter(
        (s) => s.grade === student.grade && s.sections.includes(student.section)
      );

      for (const sub of studentSubjects) {
        const teacherUserId = teacherUsers[sub.teacherId];
        if (!teacherUserId) {
          // If no user found, just log once per teacher and skip
          if (teacherUsers[sub.teacherId] !== null) {
            console.warn(`No user found for teacher ${sub.teacherId}. Skipping marks for subject ${sub.name}.`);
            teacherUsers[sub.teacherId] = null; // Mark as null to avoid repeated logs
          }
          continue;
        }

        const assessments = [
          { type: "attendance", max: 10, minScore: 7 },
          { type: "assignment", max: 10, minScore: 6 },
          { type: "quiz", max: 10, minScore: 5 },
          { type: "midterm", max: 20, minScore: 10 },
          { type: "final", max: 50, minScore: 25 }
        ];

        for (const ass of assessments) {
          const score = Math.floor(Math.random() * (ass.max - ass.minScore + 1)) + ass.minScore;

          marksToInsert.push({
            studentId: student._id,
            subjectId: sub._id,
            academicYear: "2023/2024",
            semester: 1, // Assume semester 1 for now
            assessmentType: ass.type,
            score: score,
            maxScore: ass.max,
            enteredBy: teacherUserId,
            remarks: "Seeded for pre-final"
          });
        }
      }
    }

    console.log(`Preparing to insert ${marksToInsert.length} marks...`);
    const batchSize = 1000;
    for (let i = 0; i < marksToInsert.length; i += batchSize) {
      const batch = marksToInsert.slice(i, i + batchSize);
      await Mark.insertMany(batch);
      console.log(`Inserted batch ${i / batchSize + 1}`);
    }

    console.log(`Successfully created ${marksToInsert.length} mark entries.`);
  } catch (error) {
    console.error("Error seeding marks:", error);
  } finally {
    process.exit(0);
  }
});
