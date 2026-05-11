// @ts-nocheck
const API_BASE_URL = 'http://localhost:5001/api';

const getHeaders = () => {
  const token = localStorage.getItem('sms_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Mappers to convert backend camelCase to frontend snake_case
const mapStudent = (s: any) => ({
  id: s._id,
  first_name: s.firstName,
  last_name: s.lastName,
  age: s.age,
  gender: s.gender,
  grade: s.grade,
  section: s.section,
  roll_number: s.rollNumber,
  parent_phone: s.parentPhone,
  address: s.address,
  enrolled_date: s.enrolledDate,
});

const mapTeacher = (t: any) => ({
  id: t._id,
  name: t.name,
  email: t.email,
  phone: t.phone,
  qualification: t.qualification,
  subjects: t.subjects?.map((s: any) => s._id || s) || [],
  assigned_grade: t.assignedGrade,
  assigned_section: t.assignedSection,
});

const mapSubject = (s: any) => ({
  id: s._id,
  name: s.name,
  code: s.code,
  grade: s.grade,
  teacher_id: s.teacherId?._id || s.teacherId,
});

const mapMark = (m: any) => ({
  id: m._id,
  student_id: m.studentId?._id || m.studentId,
  subject_id: m.subjectId?._id || m.subjectId,
  academic_year: m.academicYear,
  semester: m.semester,
  assessment_type: m.assessmentType,
  score: m.score,
  max_score: m.maxScore,
  remarks: m.remarks,
  entered_by: m.enteredBy,
});

const mapAttendance = (a: any) => ({
  id: a._id,
  student_id: a.studentId?._id || a.studentId,
  subject_id: a.subjectId?._id || a.subjectId,
  date: a.date,
  status: a.status,
  recorded_by: a.recordedBy,
});

export const api = {
  // Auth
  login: async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },
  
  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/auth/me`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Students
  getStudents: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/students?${query}`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.map(mapStudent);
  },
  createStudent: async (student) => {
    const backendFormat = {
      firstName: student.first_name,
      lastName: student.last_name,
      age: student.age,
      gender: student.gender,
      grade: student.grade,
      section: student.section,
      rollNumber: student.roll_number,
      parentPhone: student.parent_phone,
      address: student.address,
    };
    const res = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(backendFormat),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return mapStudent(data);
  },
  updateStudent: async (id, student) => {
    const backendFormat = {
      firstName: student.first_name,
      lastName: student.last_name,
      age: student.age,
      gender: student.gender,
      grade: student.grade,
      section: student.section,
      rollNumber: student.roll_number,
      parentPhone: student.parent_phone,
      address: student.address,
    };
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(backendFormat),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return mapStudent(data);
  },
  deleteStudent: async (id) => {
    const res = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Teachers
  getTeachers: async () => {
    const res = await fetch(`${API_BASE_URL}/teachers`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.map(mapTeacher);
  },
  createTeacher: async (teacher) => {
    const backendFormat = {
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      qualification: teacher.qualification,
      assignedGrade: teacher.assigned_grade,
      assignedSection: teacher.assigned_section,
    };
    const res = await fetch(`${API_BASE_URL}/teachers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(backendFormat),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return mapTeacher(data);
  },
  updateTeacher: async (id, teacher) => {
    const backendFormat = {
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      qualification: teacher.qualification,
      assignedGrade: teacher.assigned_grade,
      assignedSection: teacher.assigned_section,
    };
    const res = await fetch(`${API_BASE_URL}/teachers/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(backendFormat),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return mapTeacher(data);
  },
  deleteTeacher: async (id) => {
    const res = await fetch(`${API_BASE_URL}/teachers/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Subjects
  getSubjects: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/subjects?${query}`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.map(mapSubject);
  },
  createSubject: async (subject) => {
    const backendFormat = {
      name: subject.name,
      code: subject.code,
      grade: subject.grade,
      teacherId: subject.teacher_id,
    };
    const res = await fetch(`${API_BASE_URL}/subjects`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(backendFormat),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return mapSubject(data);
  },
  deleteSubject: async (id) => {
    const res = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Marks
  getMarksForStudent: async (studentId) => {
    const res = await fetch(`${API_BASE_URL}/marks/${studentId}`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.map(mapMark);
  },
  enterMarks: async (mark) => {
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
    const res = await fetch(`${API_BASE_URL}/marks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(backendFormat),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return mapMark(data);
  },

  updateMark: async (id, score) => {
    // API mock - in real app, we'd hit PUT /marks/:id
    return { id, score };
  },

  // Audit Logs
  getAuditLogs: async (page = 1, limit = 50) => {
    const res = await fetch(`${API_BASE_URL}/audit-logs?page=${page}&limit=${limit}`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Settings
  getSettings: async () => {
    const res = await fetch(`${API_BASE_URL}/settings`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
  updateSetting: async (key, value) => {
    const res = await fetch(`${API_BASE_URL}/settings/${key}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ value }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Bulk Import
  bulkImportStudents: async (students) => {
    const backendRecords = students.map((s) => ({
      firstName: s.first_name,
      lastName: s.last_name,
      age: s.age,
      gender: s.gender,
      grade: s.grade,
      section: s.section,
      rollNumber: s.roll_number,
      parentPhone: s.parent_phone,
      address: s.address,
    }));
    const res = await fetch(`${API_BASE_URL}/students/bulk`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ students: backendRecords }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  // Attendance
  getAttendance: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE_URL}/attendance?${query}`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data.map(mapAttendance);
  },
  recordAttendance: async (records) => {
    const backendRecords = records.map((r) => ({
      studentId: r.student_id,
      subjectId: r.subject_id,
      date: r.date,
      status: r.status,
    }));
    const res = await fetch(`${API_BASE_URL}/attendance/bulk`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ records: backendRecords }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};
