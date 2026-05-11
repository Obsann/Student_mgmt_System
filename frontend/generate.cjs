const fs = require('fs');

const firstNames = ['Abebe', 'Tigist', 'Dawit', 'Hiwot', 'Yonas', 'Selamawit', 'Birhanu', 'Eden', 'Samuel', 'Feven', 'Mulatu', 'Hana', 'Tesfaye', 'Kidist', 'Endale', 'Meron', 'Fikadu', 'Martha', 'Bekele', 'Bethlehem', 'Alemu', 'Lidiya', 'Haile', 'Hanna', 'Tsegaye', 'Worku', 'Aster', 'Daniel', 'Mekdes', 'Ephrem', 'Sara', 'Kidus', 'Nardos', 'Abel', 'Bruktawit', 'Ermias', 'Mahlet', 'Yonatan', 'Betelhem', 'Elias', 'Kalkidan', 'Nebiyu', 'Tsion', 'Yared', 'Frezewd', 'Henok', 'Rahel', 'Solomon', 'Ruth', 'Nahom'];
const lastNames = ['Kebede', 'Mekonen', 'Amare', 'Tadesse', 'Bekele', 'Girma', 'Hailu', 'Destaw', 'Assefa', 'Tafesse', 'Wondimu', 'Bizuneh', 'Fikre', 'Desta', 'Bizuayehu', 'Tsegaye', 'Gebremeskel', 'Abebe', 'Worku', 'Mekonnen', 'Damte', 'Fikadu', 'Alemu', 'Gebre', 'Tesfaye', 'Hailemariam', 'Demeke', 'Getachew', 'Belay', 'Yilma', 'Tilahun', 'Goshu', 'Adane', 'Zewde', 'Tefera', 'Bogale', 'Abera', 'Gizaw', 'Ashenafi', 'Berhanu'];

const getRand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const generatePhone = () => '+25191' + Math.floor(1000000 + Math.random() * 9000000);

// 80 students (Grade 9A, 9B, 10A, 10B - 20 each)
const students = [];
for (let i = 0; i < 80; i++) {
  const grade = i < 40 ? '9' : '10';
  const section = (i % 40) < 20 ? 'A' : 'B';
  const fn = getRand(firstNames);
  const ln = getRand(lastNames);
  students.push({
    id: 's' + (i + 1),
    first_name: fn,
    last_name: ln,
    age: grade === '9' ? 15 + (Math.random() > 0.5 ? 1 : 0) : 16 + (Math.random() > 0.5 ? 1 : 0),
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    grade,
    section,
    roll_number: `KR/${grade}/${section}/${String(i + 1).padStart(3, '0')}`,
    parent_phone: generatePhone(),
    address: 'Kera, Addis Ababa',
    enrolled_date: '2025-09-01'
  });
}

// 15 Teachers
const teachers = [];
const classes = [
  {g: '9', s: 'A'}, {g: '9', s: 'B'}, {g: '10', s: 'A'}, {g: '10', s: 'B'}
];

for(let i=0; i < 15; i++) {
  const fn = getRand(firstNames);
  const ln = getRand(lastNames);
  const c = classes[i % 4];
  teachers.push({
    id: 't' + (i + 1),
    name: fn + ' ' + ln,
    email: (fn + '.' + ln + '@keraschool.et').toLowerCase(),
    phone: generatePhone(),
    qualification: getRand(['BSc Mathematics', 'MSc Physics', 'BSc Biology', 'MA English', 'BA Civics', 'BSc Computer Science', 'MSc Chemistry']),
    subjects: [],
    assigned_grade: c.g,
    assigned_section: c.s
  });
}

const subjects = [
  { id: 'sub1', name: 'Mathematics', code: 'MATH', grade: '9', teacher_id: 't1' },
  { id: 'sub2', name: 'Physics', code: 'PHY', grade: '9', teacher_id: 't2' },
  { id: 'sub3', name: 'Chemistry', code: 'CHEM', grade: '9', teacher_id: 't3' },
  { id: 'sub4', name: 'Biology', code: 'BIO', grade: '9', teacher_id: 't4' },
  { id: 'sub5', name: 'English', code: 'ENG', grade: '9', teacher_id: 't5' },
  { id: 'sub6', name: 'Mathematics', code: 'MATH', grade: '10', teacher_id: 't6' },
  { id: 'sub7', name: 'Physics', code: 'PHY', grade: '10', teacher_id: 't7' },
  { id: 'sub8', name: 'Chemistry', code: 'CHEM', grade: '10', teacher_id: 't8' },
  { id: 'sub9', name: 'English', code: 'ENG', grade: '10', teacher_id: 't9' },
  { id: 'sub10', name: 'Biology', code: 'BIO', grade: '10', teacher_id: 't10' }
];

subjects.forEach(sub => {
  const t = teachers.find(t => t.id === sub.teacher_id);
  if (t) t.subjects.push(sub.id);
});

// Admin
const users = [
  {
    id: 'u1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin',
    email: 'admin@keraschool.et',
    ref_id: 'admin1'
  }
];

teachers.forEach((t, i) => {
  users.push({
    id: 'u' + (i + 2),
    username: t.email.split('@')[0],
    password: 'teacher123',
    role: 'teacher',
    name: t.name,
    email: t.email,
    ref_id: t.id
  });
});

students.forEach((s, i) => {
  const un = (s.first_name + '.' + s.last_name + s.id.replace('s','')).toLowerCase();
  users.push({
    id: 'u' + (i + 17),
    username: un,
    password: 'student123',
    role: 'student',
    name: s.first_name + ' ' + s.last_name,
    email: un + '@keraschool.et',
    ref_id: s.id
  });
});

const fileContent = `// ============================================================
// TYPES
// ============================================================

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: "Male" | "Female";
  grade: string;
  section: string;
  roll_number: string;
  parent_phone: string;
  address: string;
  enrolled_date: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  subjects: string[];
  assigned_grade: string;
  assigned_section: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  grade: string;
  teacher_id: string;
}

export interface Enrollment {
  id: string;
  student_id: string;
  subject_id: string;
  academic_year: string;
  semester: number;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  subject_id: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  recorded_by: string;
}

export interface Mark {
  id: string;
  student_id: string;
  subject_id: string;
  academic_year: string;
  semester: number;
  assessment_type: "quiz" | "midterm" | "final" | "assignment";
  score: number;
  entered_by: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: "admin" | "teacher" | "student";
  name: string;
  email?: string;
  ref_id: string;
  avatar?: string;
}

export const initialSubjects: Subject[] = ${JSON.stringify(subjects, null, 2)};
export const initialTeachers: Teacher[] = ${JSON.stringify(teachers, null, 2)};
export const initialStudents: Student[] = ${JSON.stringify(students, null, 2)};
export const initialUsers: User[] = ${JSON.stringify(users, null, 2)};

export const initialEnrollments: Enrollment[] = [];
initialStudents.forEach((student) => {
  const gradeSubjects = initialSubjects.filter(
    (sub) => sub.grade === student.grade
  );
  gradeSubjects.forEach((sub) => {
    initialEnrollments.push({
      id: Math.random().toString(36).substring(2, 10),
      student_id: student.id,
      subject_id: sub.id,
      academic_year: "2025/2026",
      semester: 1,
    });
  });
});

export const initialAttendance: AttendanceRecord[] = [];
export const initialMarks: Mark[] = [];

export interface AppState {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  enrollments: Enrollment[];
  attendance: AttendanceRecord[];
  marks: Mark[];
  users: User[];
}

export const getInitialState = (): AppState => {
  try {
    const saved = localStorage.getItem("sms_data");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.students && parsed.teachers && parsed.subjects) {
        return parsed;
      }
    }
  } catch {}
  return {
    students: initialStudents,
    teachers: initialTeachers,
    subjects: initialSubjects,
    enrollments: initialEnrollments,
    attendance: initialAttendance,
    marks: initialMarks,
    users: initialUsers,
  };
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem("sms_data", JSON.stringify(state));
  } catch {}
};
`;

fs.writeFileSync('src/data/mockData.ts', fileContent);
