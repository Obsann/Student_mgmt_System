const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Student = require("./models/Student");
const Teacher = require("./models/Teacher");
const Subject = require("./models/Subject");
const Mark = require("./models/Mark");
const Attendance = require("./models/Attendance");
const Settings = require("./models/Settings");

dotenv.config();

// ─── TEACHER DATA ───────────────────────────────────────────────────────────────

const teachersData = [
  { name: "Ephrem Worku", email: "ephrem.worku@keraschool.et", phone: "+251911595966", qualification: "BSc Computer Science", assignedGrade: "9", assignedSection: "A" },
  { name: "Hiwot Zewde", email: "hiwot.zewde@keraschool.et", phone: "+251913877337", qualification: "BSc Biology", assignedGrade: "9", assignedSection: "B" },
  { name: "Daniel Adane", email: "daniel.adane@keraschool.et", phone: "+251911904798", qualification: "MSc Physics", assignedGrade: "10", assignedSection: "A" },
  { name: "Kidist Bekele", email: "kidist.bekele@keraschool.et", phone: "+251919974427", qualification: "BA Civics", assignedGrade: "10", assignedSection: "B" },
  { name: "Abebe Zewde", email: "abebe.zewde@keraschool.et", phone: "+251912483747", qualification: "MA English", assignedGrade: "9", assignedSection: "A" },
  { name: "Worku Tilahun", email: "worku.tilahun@keraschool.et", phone: "+251917313279", qualification: "MSc Physics", assignedGrade: "9", assignedSection: "B" },
  { name: "Hiwot Bizuneh", email: "hiwot.bizuneh@keraschool.et", phone: "+251919922371", qualification: "BSc Computer Science", assignedGrade: "10", assignedSection: "A" },
  { name: "Mahlet Fikre", email: "mahlet.fikre@keraschool.et", phone: "+251916841482", qualification: "BA Civics", assignedGrade: "10", assignedSection: "B" },
  { name: "Bruktawit Bogale", email: "bruktawit.bogale@keraschool.et", phone: "+251912300884", qualification: "MSc Physics", assignedGrade: "9", assignedSection: "A" },
  { name: "Rahel Tesfaye", email: "rahel.tesfaye@keraschool.et", phone: "+251915015612", qualification: "BSc Mathematics", assignedGrade: "9", assignedSection: "B" },
  { name: "Rahel Belay", email: "rahel.belay@keraschool.et", phone: "+251916962499", qualification: "BSc Computer Science", assignedGrade: "10", assignedSection: "A" },
  { name: "Yonatan Goshu", email: "yonatan.goshu@keraschool.et", phone: "+251919727510", qualification: "BSc Biology", assignedGrade: "10", assignedSection: "B" },
  { name: "Tsion Wondimu", email: "tsion.wondimu@keraschool.et", phone: "+251911113125", qualification: "MA English", assignedGrade: "9", assignedSection: "A" },
  { name: "Hiwot Mekonnen", email: "hiwot.mekonnen@keraschool.et", phone: "+251917959364", qualification: "BSc Computer Science", assignedGrade: "9", assignedSection: "B" },
  { name: "Aster Ashenafi", email: "aster.ashenafi@keraschool.et", phone: "+251912435403", qualification: "MSc Physics", assignedGrade: "10", assignedSection: "A" },
];

// ─── SUBJECT DATA ───────────────────────────────────────────────────────────────

const subjectsData = [
  { name: "Mathematics", code: "MATH", grade: "9", teacherIndex: 0 },
  { name: "Physics", code: "PHY", grade: "9", teacherIndex: 1 },
  { name: "Chemistry", code: "CHEM", grade: "9", teacherIndex: 2 },
  { name: "Biology", code: "BIO", grade: "9", teacherIndex: 3 },
  { name: "English", code: "ENG", grade: "9", teacherIndex: 4 },
  { name: "Mathematics", code: "MATH", grade: "10", teacherIndex: 5 },
  { name: "Physics", code: "PHY", grade: "10", teacherIndex: 6 },
  { name: "Chemistry", code: "CHEM", grade: "10", teacherIndex: 7 },
  { name: "English", code: "ENG", grade: "10", teacherIndex: 8 },
  { name: "Biology", code: "BIO", grade: "10", teacherIndex: 9 },
];

// ─── STUDENT GENERATION ─────────────────────────────────────────────────────────

const firstNames = ["Mekdes","Kidist","Yonas","Hanna","Ephrem","Sara","Mahlet","Henok","Nahom","Abigail","Dawit","Tsion","Bereket","Rahel","Samuel","Tigist","Abel","Lidiya","Ermias","Bethlehem","Natnael","Feven","Eyob","Selam","Biruk","Hiwot","Yared","Fikirte","Tewodros","Meron","Amanuel","Selamawit","Dagmawi","Martha","Yoseph","Helen","Kaleab","Rediet","Mikyas","Betiel"];
const lastNames = ["Tsegaye","Desta","Girma","Bogale","Amare","Mekonnen","Fikre","Tefera","Adane","Hailemariam","Worku","Bekele","Zewde","Bizuneh","Tilahun","Ashenafi","Goshu","Wondimu","Tesfaye","Belay"];

function generateStudents() {
  const students = [];
  const grades = ["9", "10"];
  const sections = ["A", "B"];
  let idx = 1;

  for (const grade of grades) {
    for (const section of sections) {
      for (let i = 0; i < 20; i++) {
        const fn = firstNames[(idx - 1) % firstNames.length];
        const ln = lastNames[(idx - 1) % lastNames.length];
        const padded = String(idx).padStart(3, "0");
        students.push({
          firstName: fn,
          lastName: ln,
          age: grade === "9" ? 15 : 16,
          gender: idx % 2 === 0 ? "Female" : "Male",
          grade,
          section,
          rollNumber: `KR/${grade}/${section}/${padded}`,
          parentPhone: `+2519${String(10000000 + idx * 7919).slice(-8)}`,
          address: "Kera, Addis Ababa",
          enrolledDate: new Date("2025-09-01"),
          status: "active",
        });
        idx++;
      }
    }
  }
  return students;
}

// ─── SEED FUNCTION ──────────────────────────────────────────────────────────────

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✓ Connected to MongoDB");

    // Drop all collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
    console.log("✓ Cleared all existing data");

    // 1. Admin user
    await User.create({
      username: "admin@keraschool.et",
      password: "admin123",
      role: "admin",
      name: "Ato Bekele Tadesse",
      email: "admin@keraschool.et",
    });
    console.log("✓ Admin created");

    // 2. Teachers
    const createdTeachers = [];
    for (const t of teachersData) {
      const teacher = await Teacher.create(t);
      createdTeachers.push(teacher);

      const uname = t.email.split("@")[0];
      await User.create({
        username: uname,
        password: "teacher123",
        role: "teacher",
        name: t.name,
        email: t.email,
        refId: teacher._id,
      });
    }
    console.log(`✓ ${createdTeachers.length} Teachers created`);

    // 3. Subjects (linked to teachers)
    const createdSubjects = [];
    for (const s of subjectsData) {
      const subject = await Subject.create({
        name: s.name,
        code: s.code,
        grade: s.grade,
        teacherId: createdTeachers[s.teacherIndex]._id,
      });
      createdTeachers[s.teacherIndex].subjects.push(subject._id);
      await createdTeachers[s.teacherIndex].save();
      createdSubjects.push(subject);
    }
    console.log(`✓ ${createdSubjects.length} Subjects created`);

    // 4. Students
    const studentsData = generateStudents();
    const createdStudents = [];
    const usedUsernames = new Set();
    usedUsernames.add("admin@keraschool.et");
    for (const t of teachersData) {
      usedUsernames.add(t.email.split("@")[0]);
    }
    for (const s of studentsData) {
      const student = await Student.create(s);
      let uname = `${s.firstName.toLowerCase()}.${s.lastName.toLowerCase()}`;
      if (usedUsernames.has(uname)) {
        uname = `${uname}${student.grade}${student.section.toLowerCase()}`;
      }
      usedUsernames.add(uname);
      await User.create({
        username: uname,
        password: "student123",
        role: "student",
        name: `${s.firstName} ${s.lastName}`,
        email: `${uname}@keraschool.et`,
        refId: student._id,
      });
      createdStudents.push(student);
    }
    console.log(`✓ ${createdStudents.length} Students created`);

    // 5. System settings
    await Settings.create({ key: "academicYear", value: "2025/2026" });
    await Settings.create({ key: "currentSemester", value: 1 });
    await Settings.create({ key: "schoolName", value: "Kera Secondary School" });
    console.log("✓ Settings initialized");

    // ─── DEMO DATA: Marks ──────────────────────────────────────────────────────
    const assessmentTypes = ["quiz", "midterm", "assignment", "final"];
    let markCount = 0;

    for (const student of createdStudents) {
      // Seed marks for all students
      const gradeSubjects = createdSubjects.filter((s) => s.grade === student.grade);
      for (const subject of gradeSubjects) {
        for (const type of assessmentTypes.slice(0, 2)) {
          // quiz + midterm for each subject
          const score = Math.floor(Math.random() * 35) + 55; // 55-90
          await Mark.create({
            studentId: student._id,
            subjectId: subject._id,
            academicYear: "2025/2026",
            semester: 1,
            assessmentType: type,
            score,
            maxScore: 100,
            remarks: score >= 75 ? "Good" : score >= 60 ? "Satisfactory" : "Needs improvement",
            enteredBy: createdTeachers[0]._id,
          });
          markCount++;
        }
      }
    }
    console.log(`✓ ${markCount} Marks seeded`);

    // ─── DEMO DATA: Attendance ─────────────────────────────────────────────────
    const attendanceDates = [
      "2025-10-01", "2025-10-02", "2025-10-03", "2025-10-06", "2025-10-07",
      "2025-10-08", "2025-10-09", "2025-10-10", "2025-10-13", "2025-10-14",
    ];
    const statuses = ["present", "present", "present", "present", "absent", "present", "late", "present", "present", "present"];
    let attendanceCount = 0;

    for (const date of attendanceDates) {
      // Seed attendance for all students across their first subject
      for (const student of createdStudents) {
        const gradeSubjects = createdSubjects.filter((s) => s.grade === student.grade);
        if (gradeSubjects.length > 0) {
          const subject = gradeSubjects[0];
          await Attendance.create({
            studentId: student._id,
            subjectId: subject._id,
            date: new Date(date),
            status: statuses[Math.floor(Math.random() * statuses.length)],
            recordedBy: createdTeachers[0]._id,
          });
          attendanceCount++;
        }
      }
    }
    console.log(`✓ ${attendanceCount} Attendance records seeded`);

    console.log("\n═══════════════════════════════════════════════════════");
    console.log("  SEED COMPLETE — Full demo data loaded");
    console.log("═══════════════════════════════════════════════════════");
    console.log("  Admin  :  admin@keraschool.et     /  admin123");
    console.log("  Teacher:  ephrem.worku             /  teacher123");
    console.log("  Student:  mekdes.tsegaye           /  student123");
    console.log("");
    console.log(`  ${createdStudents.length} students | ${createdTeachers.length} teachers`);
    console.log(`  ${createdSubjects.length} subjects | ${markCount} marks`);
    console.log(`  ${attendanceCount} attendance records`);
    console.log("═══════════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (err) {
    console.error("✗ Seeding error:", err.message);
    process.exit(1);
  }
}

seed();
