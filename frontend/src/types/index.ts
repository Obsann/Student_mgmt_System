// ============================================================
// SHARED TYPES — used across the entire frontend
// ============================================================

export interface Student {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  gender: "Male" | "Female";
  fayda_id: string; // 12-digit unique ID

  grade_8_gpa: number;
  previous_school: string;
  national_exam_number: string;

  address: {
    region: string;
    zone: string;
    kebele: string;
    house_no: string;
  };
  
  guardian_name: string;
  guardian_relation: string;
  parent_phone: string;
  personal_email?: string;

  grade: string;
  section: string;
  roll_number: string;
  status: "active" | "withdrawn" | "pending";
  enrolled_date: string;
  avatar?: string;
  credentials_issued_at?: string | null;
  age?: number;
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
  avatar?: string;
  department?: string;
  experience?: number;
  status?: "Active" | "On Leave" | "Inactive";
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  grade: string;
  sections?: string[];
  teacher_id: string;
  department?: string;
  periodsPerWeek?: number;
  description?: string;
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
  assessment_type: "quiz" | "midterm" | "final" | "assignment" | "attendance";
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
  recoveryEmail?: string;
  ref_id: string;
  avatar?: string;
  verificationQuestions?: {question: string, answer: string}[];
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
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "Male" | "Female";
  faydaId: string;
  grade8GPA: number;
  previousSchool: string;
  nationalExamNumber: string;
  address: {
    region: string;
    zone: string;
    kebele: string;
    houseNo: string;
  };
  guardianName: string;
  guardianRelation: string;
  parentPhone: string;
  personalEmail?: string;
  grade: string;
  section: string;
  rollNumber: string;
  status: "active" | "withdrawn" | "pending";
  enrolledDate: string;
  avatar?: string;
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
  avatar?: string;
}

export interface ApiUser {
  _id: string;
  username: string;
  role: "admin" | "teacher" | "student";
  name: string;
  email?: string;
  recoveryEmail?: string;
  refId?: string;
  avatar?: string;
  verificationQuestions?: {question: string, answer: string}[];
}

export interface LoginResponse {
  token: string;
  user: ApiUser;
}

export interface ApiSubject {
  _id: string;
  name: string;
  code: string;
  grade: string;
  sections?: string[];
  teacherId: string | { _id: string };
}

export interface ApiMark {
  _id: string;
  studentId: string | { _id: string };
  subjectId: string | { _id: string };
  academicYear: string;
  semester: number;
  assessmentType: "quiz" | "midterm" | "final" | "assignment" | "attendance";
  score: number;
  maxScore?: number;
  remarks?: string;
  enteredBy: string;
}

export interface ApiAttendance {
  _id: string;
  studentId: string | { _id: string };
  subjectId: string | { _id: string };
  date: string;
  status: "present" | "absent" | "late" | "excused";
  recordedBy: string;
}
