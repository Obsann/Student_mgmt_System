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

const grades = ["9", "10", "11", "12"];
const sections = ["A", "B", "C", "D"];
const teacherFirstNames = ["Ephrem", "Hiwot", "Daniel", "Kidist", "Abebe", "Mekdes", "Tadesse", "Aster", "Solomon", "Hanna", "Yonas", "Sara", "Henok", "Mahlet", "Dawit", "Senait"];
const teacherLastNames = ["Worku", "Zewde", "Adane", "Bekele", "Kebede", "Tsegaye", "Girma", "Haile", "Desta", "Bogale", "Amare", "Mekonnen", "Fikre", "Tefera", "Assefa", "Tadesse"];
const subjectNames = ["Mathematics", "Physics", "Biology", "Chemistry", "English", "History", "Geography", "Civics", "Amharic", "ICT", "PE", "Economics", "Business", "Art", "Music", "Agriculture"];
const subjectCodes = ["MATH", "PHY", "BIO", "CHEM", "ENG", "HIS", "GEO", "CIV", "AMH", "ICT", "PE", "ECO", "BUS", "ART", "MUS", "AGR"];

// Generate 16 teachers and 64 subjects (all 16 subjects for each of the 4 grades)
const teachersData = [];
const subjectsData = [];

for (let tIdx = 0; tIdx < 16; tIdx++) {
  const fn = teacherFirstNames[tIdx];
  const ln = teacherLastNames[tIdx];

  // Distribute homeroom grades and sections across the 16 teachers
  const gradeIdx = Math.floor(tIdx / 4);
  const secIdx = tIdx % 4;
  const grade = grades[gradeIdx];
  const section = sections[secIdx];

  teachersData.push({
    name: `${fn} ${ln}`,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@keraschool.et`,
    phone: `+2519${String(11000000 + tIdx * 98765).slice(-8)}`,
    qualification: "BEd Education",
    assignedGrade: grade,
    assignedSection: section,
    experience: tIdx % 4 === 0 ? 0 : tIdx % 3 === 0 ? 2 : tIdx % 2 === 0 ? 5 : 10
  });

  const subName = subjectNames[tIdx];
  const subCode = subjectCodes[tIdx];

  // Assign this subject to all grades so every student takes it
  for (const g of grades) {
    subjectsData.push({
      name: subName,
      code: subCode,
      grade: g,
      sections: [...sections],
      teacherIndex: tIdx
    });
  }
}

// ─── STUDENT GENERATION ─────────────────────────────────────────────────────────

const firstNames = ["Abebe", "Abel", "Abigail", "Abraham", "Alemu", "Amanuel", "Amare", "Aster", "Ayantu", "Beka", "Bekele", "Bereket", "Betelhem", "Biniam", "Biruk", "Chala", "Dagmawi", "Dawit", "Demeke", "Desta", "Eden", "Elias", "Ephrem", "Eyerusalem", "Eyob", "Fasika", "Fikre", "Gelila", "Genet", "Girma", "Habtamu", "Haile", "Hanna", "Helen", "Henok", "Hiwot", "Kaleb", "Kassahun", "Kebede", "Kidist", "Lidiya", "Mahlet", "Mekdes", "Mekonnen", "Meron", "Metsihet", "Mikias", "Nahom", "Natnael", "Netsanet", "Robel", "Ruth", "Samuel", "Sara", "Selam", "Semira", "Senait", "Sisay", "Solomon", "Tadesse", "Tefera", "Tesfaye", "Teshome", "Tewodros", "Tsegaye", "Worku", "Yabsira", "Yared", "Yohannes", "Yonas", "Zelalem", "Zewde"];
const middleNames = ["Alemu", "Amare", "Assefa", "Ayalew", "Bekele", "Belay", "Bogale", "Dagne", "Dejene", "Demeke", "Desta", "Endale", "Fikre", "Gebre", "Girma", "Haile", "Kebede", "Kifle", "Lemma", "Mekonnen", "Mengesha", "Tadesse", "Tefera", "Tesfaye", "Teshome", "Tsegaye", "Worku", "Yilma", "Zewde", "Zike", "Abebe", "Abel", "Abraham", "Amanuel", "Biniam", "Biruk", "Chala", "Dagmawi", "Dawit", "Elias", "Ephrem", "Eyob", "Habtamu", "Henok", "Kaleb", "Kassahun", "Mikias", "Nahom", "Natnael", "Robel", "Samuel", "Sisay", "Solomon", "Tewodros", "Yared", "Yohannes", "Yonas", "Zelalem"];
const lastNames = ["Adane", "Alemu", "Amare", "Assefa", "Ayalew", "Bekele", "Belay", "Bogale", "Dagne", "Dejene", "Demeke", "Desta", "Endale", "Fikre", "Gebre", "Girma", "Haile", "Hailemariam", "Kebede", "Kifle", "Lemma", "Mekonnen", "Mengesha", "Tadesse", "Tefera", "Tesfaye", "Teshome", "Tsegaye", "Worku", "Yilma", "Zewde", "Zike", "Abebe", "Abel", "Abraham", "Amanuel", "Biniam", "Biruk", "Chala", "Dagmawi", "Dawit", "Elias", "Ephrem", "Eyob", "Habtamu", "Henok", "Kaleb", "Kassahun", "Mikias", "Nahom", "Natnael", "Robel", "Samuel", "Sisay", "Solomon", "Tewodros", "Yared", "Yohannes", "Yonas", "Zelalem"];

function generateStudents(adminId) {
  const students = [];
  let idx = 1;

  for (const grade of grades) {
    for (const section of sections) {
      for (let i = 0; i < 10; i++) { // 10 students per section
        const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
        const mn = middleNames[Math.floor(Math.random() * middleNames.length)];
        const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
        const padded = String(idx).padStart(4, "0");

        students.push({
          firstName: fn,
          middleName: mn,
          lastName: ln,
          dateOfBirth: new Date(2010 - parseInt(grade) + 9, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          gender: Math.random() > 0.5 ? "Female" : "Male",
          faydaId: String(100000000000 + idx),
          grade8GPA: 60 + (idx % 40),
          previousSchool: "St. Mary School",
          nationalExamNumber: `NE${padded}2026`,
          address: {
            region: "Jimma City",
            zone: "Jimma",
            kebele: "Bossa Addis",
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
      name: "Bekele Tadesse",
      email: "admin@keraschool.et",
    });
    console.log("✓ Admin created");

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
        sections: s.sections,
        teacherId: createdTeachers[s.teacherIndex]._id,
      });
      createdTeachers[s.teacherIndex].subjects.push(subject._id);
      await createdTeachers[s.teacherIndex].save();
      createdSubjects.push(subject);
    }
    console.log(`✓ ${createdSubjects.length} Subjects created`);

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

    // 6. Marks & Attendance Generation
    console.log("Generating Marks & Attendance... this might take a moment.");
    const attendanceRecords = [];
    const marksRecords = [];

    const dates = [];
    let current = new Date();
    while (dates.length < 5) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) {
        dates.unshift(new Date(current));
      }
      current.setDate(current.getDate() - 1);
    }

    for (const student of studentsData) {
      // Find the actual DB record to get the _id
      const studentRecord = await Student.findOne({ faydaId: student.faydaId });

      // Find subjects for this student's grade and section
      const studentSubjects = createdSubjects.filter(sub =>
        sub.grade === student.grade && sub.sections.includes(student.section)
      );

      for (const subject of studentSubjects) {
        // Generate 14 days attendance
        for (const date of dates) {
          const rand = Math.random();
          let status = "present";
          if (rand > 0.95) status = "absent";
          else if (rand > 0.90) status = "late";

          attendanceRecords.push({
            studentId: studentRecord._id,
            subjectId: subject._id,
            date: date,
            status: status,
            recordedBy: subject.teacherId
          });
        }

        // Generate Marks for all 5 assessment types
        const assessments = [
          { type: "attendance", max: 10, minScore: 7 },
          { type: "assignment", max: 10, minScore: 6 },
          { type: "quiz", max: 10, minScore: 5 },
          { type: "midterm", max: 20, minScore: 10 },
          { type: "final", max: 50, minScore: 25 }
        ];

        for (const ass of assessments) {
          const score = Math.floor(Math.random() * (ass.max - ass.minScore + 1)) + ass.minScore;
          marksRecords.push({
            studentId: studentRecord._id,
            subjectId: subject._id,
            academicYear: "2026/2027",
            semester: 1,
            assessmentType: ass.type,
            score: score,
            maxScore: ass.max,
            enteredBy: subject.teacherId,
            remarks: "Seeded"
          });
        }
      }
    }

    const chunkSize = 5000;
    for (let i = 0; i < attendanceRecords.length; i += chunkSize) {
      await Attendance.insertMany(attendanceRecords.slice(i, i + chunkSize));
    }
    console.log(`✓ ${attendanceRecords.length} Attendance records generated`);

    for (let i = 0; i < marksRecords.length; i += chunkSize) {
      await Mark.insertMany(marksRecords.slice(i, i + chunkSize));
    }
    console.log(`✓ ${marksRecords.length} Marks records generated`);

    // 7. Settings
    await Settings.create({ key: "academicYear", value: "2026/2027" });
    await Settings.create({ key: "currentSemester", value: 1 });
    await Settings.create({ key: "schoolName", value: "Kera Secondary School" });
    await Settings.create({ key: "registrationOpen", value: true });

    console.log("\n═══════════════════════════════════════════════════════");
    console.log("  SEED COMPLETE — Large Dataset Ready");
    console.log("═══════════════════════════════════════════════════════");
    console.log("  Admin    :  admin@keraschool.et / admin123");
    console.log(`  Teacher  :  ${teachersData[0].email.split("@")[0]} / teacher123`);
    console.log("═══════════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (err) {
    console.error("✗ Seeding error:", err.message);
    process.exit(1);
  }
}

seed();
