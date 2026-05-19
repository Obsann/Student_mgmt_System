import type {
  Student, Teacher, Subject, Mark, AttendanceRecord,
  ApiStudent, ApiTeacher, ApiSubject, ApiMark, ApiAttendance,
  LoginResponse, ApiUser, PaginatedResponse,
} from "../types";

export interface ApiPaginated<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const getHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("sms_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ─── Mappers (backend camelCase → frontend snake_case) ────────────────────────

const mapStudent = (s: ApiStudent): Student => ({
  id: s._id,
  first_name: s.firstName,
  middle_name: s.middleName,
  last_name: s.lastName,
  date_of_birth: s.dateOfBirth,
  gender: s.gender,
  fayda_id: s.faydaId,
  grade_8_gpa: s.grade8GPA,
  previous_school: s.previousSchool,
  national_exam_number: s.nationalExamNumber,
  address: {
    region: s.address.region,
    zone: s.address.zone,
    kebele: s.address.kebele,
    house_no: s.address.houseNo,
  },
  guardian_name: s.guardianName,
  guardian_relation: s.guardianRelation,
  parent_phone: s.parentPhone,
  grade: s.grade,
  section: s.section,
  roll_number: s.rollNumber,
  enrolled_date: s.enrolledDate,
  status: s.status || "active",
  personal_email: s.personalEmail || "",
  credentials_issued_at: s.credentialsIssuedAt || null,
  avatar: s.avatar || "",
});

const mapTeacher = (t: ApiTeacher): Teacher => ({
  id: t._id,
  name: t.name,
  email: t.email,
  phone: t.phone,
  qualification: t.qualification,
  subjects: t.subjects?.map((s) => (typeof s === "string" ? s : s._id)) || [],
  assigned_grade: t.assignedGrade,
  assigned_section: t.assignedSection,
  avatar: t.avatar || "",
});

const mapSubject = (s: ApiSubject): Subject => ({
  id: s._id,
  name: s.name,
  code: s.code,
  grade: s.grade,
  teacher_id: typeof s.teacherId === "string" ? s.teacherId : s.teacherId?._id,
});

const mapMark = (m: ApiMark): Mark => ({
  id: m._id,
  student_id: typeof m.studentId === "string" ? m.studentId : m.studentId?._id,
  subject_id: typeof m.subjectId === "string" ? m.subjectId : m.subjectId?._id,
  academic_year: m.academicYear,
  semester: m.semester,
  assessment_type: m.assessmentType,
  score: m.score,
  max_score: m.maxScore,
  remarks: m.remarks,
  entered_by: m.enteredBy,
});

const mapAttendance = (a: ApiAttendance): AttendanceRecord => ({
  id: a._id,
  student_id: typeof a.studentId === "string" ? a.studentId : a.studentId?._id,
  subject_id: typeof a.subjectId === "string" ? a.subjectId : a.subjectId?._id,
  date: a.date,
  status: a.status,
  recorded_by: a.recordedBy,
});

// ─── Generic fetch helper ─────────────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 45000; // 45 seconds for cold starts

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    
    let data;
    try {
      data = await res.json();
    } catch (e) {
      if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
      return null as any; // Handle empty 204 responses
    }

    if (!res.ok) {
      const errData = data as any;
      if (res.status === 401 && errData.code === "TOKEN_EXPIRED") {
        window.dispatchEvent(new CustomEvent("auth:session-expired"));
      }
      throw new Error(errData.message || errData.error || `Request failed with status ${res.status}`);
    }
    
    return data as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("Request timed out. The server might be waking up, please try again.");
    }
    throw error;
  }
}

// ─── API Methods ──────────────────────────────────────────────────────────────

export const api = {
  // Auth
  login: (username: string, password: string) =>
    apiFetch<LoginResponse>(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }),

  getMe: () =>
    apiFetch<ApiUser>(`${API_BASE_URL}/auth/me`, { headers: getHeaders() }),

  register: (username: string, password: string, name: string, email: string) =>
    apiFetch<LoginResponse>(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, name, email }),
    }),

  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch<{ message: string }>(`${API_BASE_URL}/auth/password`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  updateProfile: (updates: FormData) =>
    apiFetch<Record<string, unknown>>(`${API_BASE_URL}/auth/profile`, {
      method: "PUT",
      headers: {
        ...(localStorage.getItem("sms_token") && { Authorization: `Bearer ${localStorage.getItem("sms_token")}` }),
      },
      body: updates,
    }),

  getVerificationQuestions: (username: string) =>
    apiFetch<{ questions: string[] }>(`${API_BASE_URL}/auth/verification-questions/${encodeURIComponent(username)}`),

  forgotPassword: (username: string, answers: string[]) =>
    apiFetch<{ message: string }>(`${API_BASE_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, answers }),
    }),

  adminSendCredentials: (userId: string, email?: string) =>
    apiFetch<{ message: string; username: string }>(`${API_BASE_URL}/auth/admin/send-credentials/${userId}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    }),

  // Students
  getStudents: async (params: Record<string, string | number> = {}): Promise<{ data: Student[], total: number, page: number, totalPages: number }> => {
    const query = new URLSearchParams(params as any).toString();
    const res = await apiFetch<ApiPaginated<ApiStudent>>(`${API_BASE_URL}/students?${query}`, { headers: getHeaders() });
    return {
      data: res.data.map(mapStudent),
      total: res.total,
      page: res.page,
      totalPages: res.totalPages
    };
  },

  createStudent: async (student: Omit<Student, "id">): Promise<Student> => {
    const backendFormat = {
      firstName: student.first_name,
      middleName: student.middle_name,
      lastName: student.last_name,
      dateOfBirth: student.date_of_birth,
      gender: student.gender,
      faydaId: student.fayda_id,
      grade8GPA: student.grade_8_gpa,
      previousSchool: student.previous_school,
      nationalExamNumber: student.national_exam_number,
      address: {
        region: student.address.region,
        zone: student.address.zone,
        kebele: student.address.kebele,
        houseNo: student.address.house_no,
      },
      guardianName: student.guardian_name,
      guardianRelation: student.guardian_relation,
      parentPhone: student.parent_phone,
      personalEmail: student.personal_email || "",
      grade: student.grade,
      section: student.section,
      rollNumber: student.roll_number,
    };
    const data = await apiFetch<ApiStudent>(`${API_BASE_URL}/students`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(backendFormat),
    });
    return mapStudent(data);
  },

  updateStudent: async (id: string, student: Partial<Student>): Promise<Student> => {
    const backendFormat: any = {};
    if (student.first_name) backendFormat.firstName = student.first_name;
    if (student.middle_name) backendFormat.middleName = student.middle_name;
    if (student.last_name) backendFormat.lastName = student.last_name;
    if (student.date_of_birth) backendFormat.dateOfBirth = student.date_of_birth;
    if (student.gender) backendFormat.gender = student.gender;
    if (student.fayda_id) backendFormat.faydaId = student.fayda_id;
    if (student.grade_8_gpa) backendFormat.grade8GPA = student.grade_8_gpa;
    if (student.previous_school) backendFormat.previousSchool = student.previous_school;
    if (student.national_exam_number) backendFormat.nationalExamNumber = student.national_exam_number;
    if (student.address) {
      backendFormat.address = {
        region: student.address.region,
        zone: student.address.zone,
        kebele: student.address.kebele,
        houseNo: student.address.house_no,
      };
    }
    if (student.guardian_name) backendFormat.guardianName = student.guardian_name;
    if (student.guardian_relation) backendFormat.guardianRelation = student.guardian_relation;
    if (student.parent_phone) backendFormat.parentPhone = student.parent_phone;
    if (student.grade) backendFormat.grade = student.grade;
    if (student.section) backendFormat.section = student.section;
    if (student.roll_number) backendFormat.rollNumber = student.roll_number;
    if (student.status) backendFormat.status = student.status;

    const data = await apiFetch<ApiStudent>(`${API_BASE_URL}/students/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(backendFormat),
    });
    return mapStudent(data);
  },

  deleteStudent: (id: string) =>
    apiFetch<{ message: string }>(`${API_BASE_URL}/students/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }),

  getPendingStudents: async (): Promise<{ data: Student[], total: number, page: number, totalPages: number }> => {
    const res = await apiFetch<ApiPaginated<ApiStudent>>(`${API_BASE_URL}/students?status=pending`, { headers: getHeaders() });
    return {
      data: res.data.map(mapStudent),
      total: res.total,
      page: res.page,
      totalPages: res.totalPages
    };
  },

  issueCredentials: (studentId: string, email?: string) =>
    apiFetch<{ message: string; username: string; student: ApiStudent }>(
      `${API_BASE_URL}/students/${studentId}/issue-credentials`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ email }),
      }
    ),

  // Teachers
  getTeachers: async (params: Record<string, string | number> = {}): Promise<{ data: Teacher[], total: number, page: number, totalPages: number }> => {
    const query = new URLSearchParams(params as any).toString();
    const res = await apiFetch<ApiPaginated<ApiTeacher>>(`${API_BASE_URL}/teachers?${query}`, { headers: getHeaders() });
    return {
      data: res.data.map(mapTeacher),
      total: res.total,
      page: res.page,
      totalPages: res.totalPages
    };
  },

  createTeacher: async (teacher: Omit<Teacher, "id">): Promise<Teacher> => {
    const backendFormat = {
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      qualification: teacher.qualification,
      assignedGrade: teacher.assigned_grade,
      assignedSection: teacher.assigned_section,
    };
    const data = await apiFetch<ApiTeacher>(`${API_BASE_URL}/teachers`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(backendFormat),
    });
    return mapTeacher(data);
  },

  updateTeacher: async (id: string, teacher: Partial<Teacher>): Promise<Teacher> => {
    const backendFormat: any = {};
    if (teacher.name) backendFormat.name = teacher.name;
    if (teacher.email) backendFormat.email = teacher.email;
    if (teacher.phone) backendFormat.phone = teacher.phone;
    if (teacher.qualification) backendFormat.qualification = teacher.qualification;
    if (teacher.assigned_grade) backendFormat.assignedGrade = teacher.assigned_grade;
    if (teacher.assigned_section) backendFormat.assignedSection = teacher.assigned_section;

    const data = await apiFetch<ApiTeacher>(`${API_BASE_URL}/teachers/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(backendFormat),
    });
    return mapTeacher(data);
  },

  deleteTeacher: (id: string) =>
    apiFetch<{ message: string }>(`${API_BASE_URL}/teachers/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }),

  getSubjects: async (params: Record<string, string | number> = {}): Promise<{ data: Subject[], total: number, page: number, totalPages: number }> => {
    const query = new URLSearchParams(params as any).toString();
    const res = await apiFetch<ApiPaginated<ApiSubject>>(`${API_BASE_URL}/subjects?${query}`, { headers: getHeaders() });
    return {
      data: res.data.map(mapSubject),
      total: res.total,
      page: res.page,
      totalPages: res.totalPages
    };
  },

  createSubject: async (subject: Omit<Subject, "id">): Promise<Subject> => {
    const backendFormat = {
      name: subject.name,
      code: subject.code,
      grade: subject.grade,
      teacherId: subject.teacher_id,
    };
    const data = await apiFetch<ApiSubject>(`${API_BASE_URL}/subjects`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(backendFormat),
    });
    return mapSubject(data);
  },

  updateSubject: async (id: string, subject: Partial<Subject>): Promise<Subject> => {
    const backendFormat: any = {};
    if (subject.name) backendFormat.name = subject.name;
    if (subject.code) backendFormat.code = subject.code;
    if (subject.grade) backendFormat.grade = subject.grade;
    if (subject.teacher_id) backendFormat.teacherId = subject.teacher_id;

    const data = await apiFetch<ApiSubject>(`${API_BASE_URL}/subjects/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(backendFormat),
    });
    return mapSubject(data);
  },

  deleteSubject: (id: string) =>
    apiFetch<{ message: string }>(`${API_BASE_URL}/subjects/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    }),

  // Marks
  getAllMarks: async (params: Record<string, string> = {}): Promise<Mark[]> => {
    const query = new URLSearchParams(params).toString();
    const data = await apiFetch<ApiMark[]>(`${API_BASE_URL}/marks?${query}`, { headers: getHeaders() });
    return data.map(mapMark);
  },

  getMarksForStudent: async (studentId: string): Promise<Mark[]> => {
    if (!studentId) return [];
    const data = await apiFetch<ApiMark[]>(`${API_BASE_URL}/marks/${studentId}`, { headers: getHeaders() });
    return data.map(mapMark);
  },

  enterMarks: async (mark: Omit<Mark, "id">): Promise<Mark> => {
    const backendFormat = {
      studentId: mark.student_id,
      subjectId: mark.subject_id,
      academicYear: mark.academic_year,
      semester: mark.semester,
      assessmentType: mark.assessment_type,
      score: mark.score,
      maxScore: mark.max_score || 100,
      remarks: mark.remarks || "",
    };
    const data = await apiFetch<ApiMark>(`${API_BASE_URL}/marks`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(backendFormat),
    });
    return mapMark(data);
  },

  // Audit Logs
  getAuditLogs: (page = 1, limit = 50) =>
    apiFetch<{ logs: unknown[]; total: number; page: number; pages: number }>(
      `${API_BASE_URL}/audit-logs?page=${page}&limit=${limit}`,
      { headers: getHeaders() }
    ),

  // Settings
  getSettings: () =>
    apiFetch<Record<string, unknown>>(`${API_BASE_URL}/settings`, { headers: getHeaders() }),

  updateSetting: (key: string, value: unknown) =>
    apiFetch<Record<string, unknown>>(`${API_BASE_URL}/settings/${key}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ value }),
    }),

  // Bulk Import
  bulkImportStudents: async (students: Omit<Student, "id">[]) => {
    const backendRecords = students.map((s) => ({
      firstName: s.first_name,
      middleName: s.middle_name,
      lastName: s.last_name,
      dateOfBirth: s.date_of_birth,
      gender: s.gender,
      faydaId: s.fayda_id,
      grade8GPA: s.grade_8_gpa,
      previousSchool: s.previous_school,
      nationalExamNumber: s.national_exam_number,
      address: {
        region: s.address.region,
        zone: s.address.zone,
        kebele: s.address.kebele,
        houseNo: s.address.house_no,
      },
      guardianName: s.guardian_name,
      guardianRelation: s.guardian_relation,
      parentPhone: s.parent_phone,
      personalEmail: s.personal_email || "",
      grade: s.grade,
      section: s.section,
      rollNumber: s.roll_number,
    }));
    return apiFetch<{ message: string; students: ApiStudent[] }>(`${API_BASE_URL}/students/bulk`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ students: backendRecords }),
    });
  },

  // Attendance
  getAttendance: async (params: Record<string, string> = {}): Promise<AttendanceRecord[]> => {
    const query = new URLSearchParams(params).toString();
    const data = await apiFetch<ApiAttendance[]>(`${API_BASE_URL}/attendance?${query}`, { headers: getHeaders() });
    return data.map(mapAttendance);
  },

  recordAttendance: (records: Omit<AttendanceRecord, "id">[]) => {
    const backendRecords = records.map((r) => ({
      studentId: r.student_id,
      subjectId: r.subject_id,
      date: r.date,
      status: r.status,
    }));
    return apiFetch<{ message: string; records: ApiAttendance[] }>(`${API_BASE_URL}/attendance/bulk`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ records: backendRecords }),
    });
  },
};
