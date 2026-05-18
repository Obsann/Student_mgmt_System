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
];

// ─── SUBJECT DATA ───────────────────────────────────────────────────────────────

const subjectsData = [
  { name: "Mathematics", code: "MATH", grade: "9", teacherIndex: 0 },
  { name: "Physics", code: "PHY", grade: "9", teacherIndex: 1 },
  { name: "Biology", code: "BIO", grade: "10", teacherIndex: 2 },
  { name: "Civics", code: "CIV", grade: "10", teacherIndex: 3 },
];

// ─── STUDENT GENERATION ─────────────────────────────────────────────────────────

const firstNames = ["Mekdes","Kidist","Yonas","Hanna","Ephrem","Sara","Mahlet","Henok","Nahom","Abigail"];
const middleNames = ["Teshome","Bekele","Girma","Haile","Tsegaye","Desta","Bogale","Amare","Mekonnen","Fikre"];
const lastNames = ["Tsegaye","Desta","Girma","Bogale","Amare","Mekonnen","Fikre","Tefera","Adane","Hailemariam"];

function generateStudents(adminId) {
  const students = [];
  const grades = ["9", "10"];
  const sections = ["A", "B"];
  let idx = 1;

  for (const grade of grades) {
    for (const section of sections) {
      for (let i = 0; i < 5; i++) {
        const fn = firstNames[(idx - 1) % firstNames.length];
        const mn = middleNames[(idx - 1) % middleNames.length];
        const ln = lastNames[(idx - 1) % lastNames.length];
        const padded = String(idx).padStart(3, "0");
        students.push({
          firstName: fn,
          middleName: mn,
          lastName: ln,
          dateOfBirth: new Date("2009-05-15"),
          gender: idx % 2 === 0 ? "Female" : "Male",
          faydaId: String(100000000000 + idx),
          grade8GPA: 85.5,
          previousSchool: "St. Mary School",
          nationalExamNumber: `NE${padded}2025`,
          address: {
            region: "Addis Ababa",
            zone: "Kirkos",
            kebele: "02",
            houseNo: String(100 + idx),
          },
          guardianName: `${ln} Senior`,
          guardianRelation: "Father",
          parentPhone: `+2519${String(10000000 + idx * 7919).slice(-8)}`,
          grade,
          section,
          rollNumber: `KR/${grade}/${section}/${padded}`,
          status: "active",
          addedBy: adminId,
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
    const admin = await User.create({
      username: "admin@keraschool.et",
      password: "admin123",
      role: "admin",
      name: "Ato Bekele Tadesse",
      email: "admin@keraschool.et",
    });
    console.log("✓ Admin created");

    // 2. Registrar user
    await User.create({
      username: "registrar",
      password: "registrar123",
      role: "registrar",
      name: "W/ro Aster Kassa",
      email: "registrar@keraschool.et",
    });
    console.log("✓ Registrar created");

    // 3. Teachers
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

    // 4. Subjects
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

    // 5. Students
    const studentsData = generateStudents(admin._id);
    for (const s of studentsData) {
      const student = await Student.create(s);
      let uname = `${s.firstName.toLowerCase()}.${s.lastName.toLowerCase()}.${student._id.toString().slice(-3)}`;
      await User.create({
        username: uname,
        password: "student123",
        role: "student",
        name: `${s.firstName} ${s.lastName}`,
        email: `${uname}@keraschool.et`,
        refId: student._id,
      });
    }
    console.log(`✓ ${studentsData.length} Students created`);

    // 6. Settings
    await Settings.create({ key: "academicYear", value: "2025/2026" });
    await Settings.create({ key: "currentSemester", value: 1 });
    await Settings.create({ key: "schoolName", value: "Kera Secondary School" });

    console.log("\n═══════════════════════════════════════════════════════");
    console.log("  SEED COMPLETE — New Module Ready");
    console.log("═══════════════════════════════════════════════════════");
    console.log("  Admin    :  admin@keraschool.et / admin123");
    console.log("  Registrar:  registrar           / registrar123");
    console.log("  Teacher  :  ephrem.worku        / teacher123");
    console.log("═══════════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (err) {
    console.error("✗ Seeding error:", err.message);
    process.exit(1);
  }
}

seed();
