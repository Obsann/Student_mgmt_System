// ============================================================
// SHARED TYPES — used across the entire frontend
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
  status?: "pending" | "active";
  personal_email?: string;
  credentials_issued_at?: string | null;
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
  max_score?: number;
  remarks?: string;
  entered_by: string;
}

export interface User {
  id: string;
  username: string;
  role: "admin" | "teacher" | "student";
  name: string;
  email?: string;
  ref_id: string;
  avatar?: string;
}

export interface AppState {
  users: User[];
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  enrollments: Enrollment[];
  attendance: AttendanceRecord[];
  marks: Mark[];
}

// ============================================================
// API RESPONSE TYPES (raw backend shapes before mapping)
// ============================================================

export interface ApiStudent {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: "Male" | "Female";
  grade: string;
  section: string;
  rollNumber: string;
  parentPhone: string;
  address: string;
  enrolledDate: string;
  status?: "pending" | "active";
  personalEmail?: string;
  credentialsIssuedAt?: string | null;
}

export interface ApiTeacher {
  _id: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  subjects: Array<{ _id: string } | string>;
  assignedGrade: string;
  assignedSection: string;
}

export interface ApiSubject {
  _id: string;
  name: string;
  code: string;
  grade: string;
  teacherId: { _id: string } | string;
}

export interface ApiMark {
  _id: string;
  studentId: { _id: string } | string;
  subjectId: { _id: string } | string;
  academicYear: string;
  semester: number;
  assessmentType: "quiz" | "midterm" | "final" | "assignment";
  score: number;
  maxScore: number;
  remarks: string;
  enteredBy: string;
}

export interface ApiAttendance {
  _id: string;
  studentId: { _id: string } | string;
  subjectId: { _id: string } | string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  recordedBy: string;
}

export interface ApiUser {
  _id: string;
  username: string;
  role: "admin" | "teacher" | "student";
  name: string;
  email?: string;
  refId?: string;
}

export interface LoginResponse {
  token: string;
  user: ApiUser;
}

export interface ApiError {
  message: string;
}
