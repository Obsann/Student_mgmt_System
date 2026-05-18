export interface AdminTeacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  subjects: string[];
  qualification: string;
  experience: number;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinDate: string;
  gender: 'Male' | 'Female';
  salary: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  grade: string;
  teacher: string;
  periodsPerWeek: number;
  status: 'Active' | 'Inactive';
  description: string;
}

export interface AuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  category: 'Student' | 'Teacher' | 'Attendance' | 'Marks' | 'System' | 'Enrollment';
  details: string;
  timestamp: string;
  ip: string;
}

export interface EnrollmentRequest {
  id: string;
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  grade: string;
  section: string;
  gender: 'Male' | 'Female';
  age: number;
  address: string;
  previousSchool: string;
  submittedDate: string;
  documents: string[];
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
}

export interface ReportData {
  id: string;
  title: string;
  type: 'Academic' | 'Attendance' | 'Financial' | 'Teacher';
  generatedDate: string;
  generatedBy: string;
  format: string;
  size: string;
  status: 'Ready' | 'Generating' | 'Failed';
}

export const adminTeachers: AdminTeacher[] = [
  { id: 'T-001', firstName: 'Dereje', lastName: 'Bekele', email: 'dereje.b@kerahighschool.edu.et', phone: '+251 913 456 789', department: 'Natural Science', subjects: ['Mathematics', 'Physics'], qualification: 'MSc Applied Mathematics', experience: 8, status: 'Active', joinDate: '2017-09-15', gender: 'Male', salary: '18,500 ETB' },
  { id: 'T-002', firstName: 'Alemnesh', lastName: 'Gemechu', email: 'alemnesh.g@kerahighschool.edu.et', phone: '+251 914 567 890', department: 'Natural Science', subjects: ['Chemistry', 'Biology'], qualification: 'MSc Chemistry', experience: 12, status: 'Active', joinDate: '2013-09-01', gender: 'Female', salary: '20,000 ETB' },
  { id: 'T-003', firstName: 'Fikadu', lastName: 'Tesgaya', email: 'fikadu.t@kerahighschool.edu.et', phone: '+251 915 678 901', department: 'Language', subjects: ['English'], qualification: 'MA English Literature', experience: 6, status: 'Active', joinDate: '2019-09-01', gender: 'Male', salary: '16,000 ETB' },
  { id: 'T-004', firstName: 'Tigist', lastName: 'Mengistu', email: 'tigist.m@kerahighschool.edu.et', phone: '+251 916 789 012', department: 'Social Science', subjects: ['History', 'Geography'], qualification: 'MA History', experience: 10, status: 'Active', joinDate: '2015-09-01', gender: 'Female', salary: '19,000 ETB' },
  { id: 'T-005', firstName: 'Solomon', lastName: 'Abate', email: 'solomon.a@kerahighschool.edu.et', phone: '+251 917 890 123', department: 'Natural Science', subjects: ['Biology'], qualification: 'BSc Biology', experience: 4, status: 'Active', joinDate: '2021-09-01', gender: 'Male', salary: '14,500 ETB' },
  { id: 'T-006', firstName: 'Hiwot', lastName: 'Dagne', email: 'hiwot.d@kerahighschool.edu.et', phone: '+251 918 901 234', department: 'Language', subjects: ['Amharic', 'Afaan Oromoo'], qualification: 'MA Linguistics', experience: 15, status: 'Active', joinDate: '2010-09-01', gender: 'Female', salary: '22,000 ETB' },
  { id: 'T-007', firstName: 'Berhanu', lastName: 'Wolde', email: 'berhanu.w@kerahighschool.edu.et', phone: '+251 919 012 345', department: 'Social Science', subjects: ['Civics', 'Economics'], qualification: 'MA Political Science', experience: 7, status: 'On Leave', joinDate: '2018-09-01', gender: 'Male', salary: '17,000 ETB' },
  { id: 'T-008', firstName: 'Selamawit', lastName: 'Ayana', email: 'selamawit.a@kerahighschool.edu.et', phone: '+251 911 123 456', department: 'IT', subjects: ['IT', 'Mathematics'], qualification: 'MSc Computer Science', experience: 3, status: 'Active', joinDate: '2022-09-01', gender: 'Female', salary: '16,500 ETB' },
  { id: 'T-009', firstName: 'Kassahun', lastName: 'Feyisa', email: 'kassahun.f@kerahighschool.edu.et', phone: '+251 912 234 567', department: 'Natural Science', subjects: ['Physics'], qualification: 'MSc Physics', experience: 9, status: 'Active', joinDate: '2016-09-01', gender: 'Male', salary: '18,000 ETB' },
  { id: 'T-010', firstName: 'Mestawet', lastName: 'Legesse', email: 'mestawet.l@kerahighschool.edu.et', phone: '+251 913 345 678', department: 'Social Science', subjects: ['Geography'], qualification: 'MA Geography', experience: 5, status: 'Inactive', joinDate: '2020-09-01', gender: 'Female', salary: '15,000 ETB' },
  { id: 'T-011', firstName: 'Endale', lastName: 'Nigusse', email: 'endale.n@kerahighschool.edu.et', phone: '+251 914 456 789', department: 'Language', subjects: ['Afaan Oromoo'], qualification: 'MA Oromo Literature', experience: 11, status: 'Active', joinDate: '2014-09-01', gender: 'Male', salary: '19,500 ETB' },
  { id: 'T-012', firstName: 'Aster', lastName: 'Bogale', email: 'aster.b@kerahighschool.edu.et', phone: '+251 915 567 890', department: 'Natural Science', subjects: ['Chemistry'], qualification: 'MSc Chemistry', experience: 6, status: 'Active', joinDate: '2019-09-01', gender: 'Female', salary: '17,000 ETB' },
];

export const subjects: Subject[] = [
  { id: 'SUB-001', name: 'Mathematics', code: 'MATH-101', department: 'Natural Science', grade: '9,10', teacher: 'Dereje Bekele', periodsPerWeek: 6, status: 'Active', description: 'Core mathematics covering algebra, geometry, and calculus basics' },
  { id: 'SUB-002', name: 'Physics', code: 'PHYS-101', department: 'Natural Science', grade: '9,10', teacher: 'Dereje Bekele / Kassahun Feyisa', periodsPerWeek: 4, status: 'Active', description: 'Mechanics, thermodynamics, optics, and electromagnetism fundamentals' },
  { id: 'SUB-003', name: 'Chemistry', code: 'CHEM-101', department: 'Natural Science', grade: '9,10', teacher: 'Alemnesh Gemechu / Aster Bogale', periodsPerWeek: 4, status: 'Active', description: 'Organic, inorganic, and physical chemistry' },
  { id: 'SUB-004', name: 'Biology', code: 'BIO-101', department: 'Natural Science', grade: '9,10', teacher: 'Alemnesh Gemechu / Solomon Abate', periodsPerWeek: 4, status: 'Active', description: 'Cell biology, genetics, ecology, and human biology' },
  { id: 'SUB-005', name: 'English', code: 'ENG-101', department: 'Language', grade: '9,10', teacher: 'Fikadu Tesgaya', periodsPerWeek: 5, status: 'Active', description: 'English language skills including grammar, writing, and literature' },
  { id: 'SUB-006', name: 'Amharic', code: 'AMH-101', department: 'Language', grade: '9,10', teacher: 'Hiwot Dagne', periodsPerWeek: 4, status: 'Active', description: 'Amharic language grammar, literature, and composition' },
  { id: 'SUB-007', name: 'Afaan Oromoo', code: 'ORO-101', department: 'Language', grade: '9,10', teacher: 'Hiwot Dagne / Endale Nigusse', periodsPerWeek: 4, status: 'Active', description: 'Afaan Oromoo language, grammar, and literature' },
  { id: 'SUB-008', name: 'History', code: 'HIST-101', department: 'Social Science', grade: '9,10', teacher: 'Tigist Mengistu', periodsPerWeek: 3, status: 'Active', description: 'Ethiopian and world history' },
  { id: 'SUB-009', name: 'Geography', code: 'GEO-101', department: 'Social Science', grade: '9,10', teacher: 'Tigist Mengistu / Mestawet Legesse', periodsPerWeek: 3, status: 'Active', description: 'Physical and human geography of Ethiopia and the world' },
  { id: 'SUB-010', name: 'Civics', code: 'CIV-101', department: 'Social Science', grade: '9,10', teacher: 'Berhanu Wolde', periodsPerWeek: 2, status: 'Active', description: 'Civic education, ethics, and democratic values' },
  { id: 'SUB-011', name: 'Economics', code: 'ECO-101', department: 'Social Science', grade: '10', teacher: 'Berhanu Wolde', periodsPerWeek: 3, status: 'Active', description: 'Basic economics principles and Ethiopian economy' },
  { id: 'SUB-012', name: 'Information Technology', code: 'IT-101', department: 'IT', grade: '9,10', teacher: 'Selamawit Ayana', periodsPerWeek: 3, status: 'Active', description: 'Computer fundamentals, programming basics, and digital literacy' },
  { id: 'SUB-013', name: 'Physical Education', code: 'PE-101', department: 'Arts', grade: '9,10', teacher: 'Unassigned', periodsPerWeek: 2, status: 'Active', description: 'Sports, fitness, and health education' },
  { id: 'SUB-014', name: 'Art', code: 'ART-101', department: 'Arts', grade: '9', teacher: 'Unassigned', periodsPerWeek: 2, status: 'Inactive', description: 'Visual arts, drawing, and creative expression' },
];

export const enrollmentRequests: EnrollmentRequest[] = [
  { id: 'ENR-001', studentName: 'Bereket Tadesse', parentName: 'Tadesse Worku', email: 'tadesse.w@email.com', phone: '+251 912 111 222', grade: '9', section: 'A', gender: 'Male', age: 14, address: 'Jimma, Kochi', previousSchool: 'Jimma Primary School', submittedDate: '2025-01-15', documents: ['Transcript', 'Birth Certificate', 'Passport Photo'], status: 'Pending' },
  { id: 'ENR-002', studentName: 'Nardos Girma', parentName: 'Girma Ayana', email: 'girma.a@email.com', phone: '+251 913 222 333', grade: '9', section: 'B', gender: 'Female', age: 15, address: 'Jimma, Hermata', previousSchool: 'St. Mary School', submittedDate: '2025-01-14', documents: ['Transcript', 'Birth Certificate', 'Passport Photo', 'Recommendation Letter'], status: 'Under Review' },
  { id: 'ENR-003', studentName: 'Yohannes Moges', parentName: 'Moges Demissie', email: 'moges.d@email.com', phone: '+251 914 333 444', grade: '10', section: 'A', gender: 'Male', age: 16, address: 'Jimma, Bosa', previousSchool: 'Jimma Preparatory School', submittedDate: '2025-01-13', documents: ['Transcript', 'Birth Certificate'], status: 'Pending' },
  { id: 'ENR-004', studentName: 'Fikirte Kebede', parentName: 'Kebede Hailu', email: 'kebede.h@email.com', phone: '+251 915 444 555', grade: '9', section: 'A', gender: 'Female', age: 14, address: 'Jimma, Seto', previousSchool: 'Kochi Primary School', submittedDate: '2025-01-12', documents: ['Transcript', 'Birth Certificate', 'Passport Photo'], status: 'Approved' },
  { id: 'ENR-005', studentName: 'Mathewos Assefa', parentName: 'Assefa Belete', email: 'assefa.b@email.com', phone: '+251 916 555 666', grade: '10', section: 'B', gender: 'Male', age: 17, address: 'Jimma, Mendera', previousSchool: 'Hermata Secondary School', submittedDate: '2025-01-11', documents: ['Transcript', 'Birth Certificate', 'Passport Photo', 'Transfer Letter'], status: 'Rejected' },
  { id: 'ENR-006', studentName: 'Helen Teshome', parentName: 'Teshome Gebre', email: 'teshome.g@email.com', phone: '+251 917 666 777', grade: '9', section: 'A', gender: 'Female', age: 15, address: 'Jimma, Kochi', previousSchool: 'Bosa Primary School', submittedDate: '2025-01-10', documents: ['Transcript', 'Birth Certificate'], status: 'Pending' },
  { id: 'ENR-007', studentName: 'Abenezer Chala', parentName: 'Chala Tolera', email: 'chala.t@email.com', phone: '+251 918 777 888', grade: '10', section: 'A', gender: 'Male', age: 16, address: 'Jimma, Hermata', previousSchool: 'Seto Secondary School', submittedDate: '2025-01-09', documents: ['Transcript', 'Birth Certificate', 'Passport Photo'], status: 'Under Review' },
  { id: 'ENR-008', studentName: 'Betelhem Dejene', parentName: 'Dejene Mekonnen', email: 'dejene.m@email.com', phone: '+251 919 888 999', grade: '9', section: 'B', gender: 'Female', age: 14, address: 'Jimma, Bosa', previousSchool: 'Mendera Primary School', submittedDate: '2025-01-08', documents: ['Transcript', 'Birth Certificate', 'Passport Photo', 'Recommendation Letter'], status: 'Pending' },
];

export const auditLogs: AuditLog[] = [
  { id: 'LOG-001', user: 'Admin', role: 'Administrator', action: 'Created', category: 'Student', details: 'Registered new student: Abebe Girma (S-2024-001)', timestamp: '2025-01-17 09:15:23', ip: '192.168.1.100' },
  { id: 'LOG-002', user: 'Dereje Bekele', role: 'Teacher', action: 'Updated', category: 'Marks', details: 'Updated Mathematics quiz marks for Grade 9A', timestamp: '2025-01-17 10:30:45', ip: '192.168.1.101' },
  { id: 'LOG-003', user: 'Admin', role: 'Administrator', action: 'Approved', category: 'Enrollment', details: 'Approved enrollment for Fikirte Kebede (ENR-004)', timestamp: '2025-01-17 11:05:12', ip: '192.168.1.100' },
  { id: 'LOG-004', user: 'Alemnesh Gemechu', role: 'Teacher', action: 'Created', category: 'Attendance', details: 'Submitted attendance for Grade 9B - Chemistry class', timestamp: '2025-01-17 08:45:00', ip: '192.168.1.102' },
  { id: 'LOG-005', user: 'Admin', role: 'Administrator', action: 'Updated', category: 'Teacher', details: 'Updated teacher status: Berhanu Wolde → On Leave', timestamp: '2025-01-16 14:20:30', ip: '192.168.1.100' },
  { id: 'LOG-006', user: 'Admin', role: 'Administrator', action: 'Rejected', category: 'Enrollment', details: 'Rejected enrollment for Mathewos Assefa (ENR-005) - incomplete documents', timestamp: '2025-01-16 13:45:15', ip: '192.168.1.100' },
  { id: 'LOG-007', user: 'Tigist Mengistu', role: 'Teacher', action: 'Updated', category: 'Marks', details: 'Updated History midterm marks for Grade 10A', timestamp: '2025-01-16 16:00:00', ip: '192.168.1.103' },
  { id: 'LOG-008', user: 'Admin', role: 'Administrator', action: 'Created', category: 'System', details: 'System backup completed successfully', timestamp: '2025-01-16 23:00:00', ip: '192.168.1.1' },
  { id: 'LOG-009', user: 'Selamawit Ayana', role: 'Teacher', action: 'Created', category: 'Attendance', details: 'Submitted attendance for Grade 10A - IT class', timestamp: '2025-01-16 09:15:00', ip: '192.168.1.104' },
  { id: 'LOG-010', user: 'Admin', role: 'Administrator', action: 'Updated', category: 'Student', details: 'Transferred student Yonas Alemu from Section A to Section B', timestamp: '2025-01-15 11:30:00', ip: '192.168.1.100' },
  { id: 'LOG-011', user: 'Admin', role: 'Administrator', action: 'Created', category: 'System', details: 'Published Semester 1 exam schedule', timestamp: '2025-01-15 08:00:00', ip: '192.168.1.100' },
  { id: 'LOG-012', user: 'Dereje Bekele', role: 'Teacher', action: 'Updated', category: 'Marks', details: 'Updated Physics quiz marks for Grade 9A', timestamp: '2025-01-15 14:20:00', ip: '192.168.1.101' },
  { id: 'LOG-013', user: 'Admin', role: 'Administrator', action: 'Created', category: 'Teacher', details: 'Registered new teacher: Selamawit Ayana (T-008)', timestamp: '2025-01-14 09:00:00', ip: '192.168.1.100' },
  { id: 'LOG-014', user: 'Admin', role: 'Administrator', action: 'Updated', category: 'System', details: 'Updated school calendar for Semester 2', timestamp: '2025-01-14 10:30:00', ip: '192.168.1.100' },
  { id: 'LOG-015', user: 'Fikadu Tesgaya', role: 'Teacher', action: 'Created', category: 'Attendance', details: 'Submitted attendance for Grade 9B - English class', timestamp: '2025-01-14 08:50:00', ip: '192.168.1.105' },
];

export const reports: ReportData[] = [
  { id: 'RPT-001', title: 'Semester 1 Academic Performance Report', type: 'Academic', generatedDate: '2025-01-17', generatedBy: 'Admin', format: 'PDF', size: '2.4 MB', status: 'Ready' },
  { id: 'RPT-002', title: 'Monthly Attendance Summary - January 2025', type: 'Attendance', generatedDate: '2025-01-17', generatedBy: 'Admin', format: 'Excel', size: '1.1 MB', status: 'Ready' },
  { id: 'RPT-003', title: 'Teacher Performance Evaluation Q1', type: 'Teacher', generatedDate: '2025-01-16', generatedBy: 'Admin', format: 'PDF', size: '3.2 MB', status: 'Ready' },
  { id: 'RPT-004', title: 'Financial Report - Q2 2024/2025', type: 'Financial', generatedDate: '2025-01-15', generatedBy: 'Admin', format: 'PDF', size: '1.8 MB', status: 'Ready' },
  { id: 'RPT-005', title: 'Grade 9 Midterm Results Analysis', type: 'Academic', generatedDate: '2025-01-15', generatedBy: 'Dereje Bekele', format: 'Excel', size: '856 KB', status: 'Ready' },
  { id: 'RPT-006', title: 'Enrollment Statistics 2024/2025', type: 'Academic', generatedDate: '2025-01-14', generatedBy: 'Admin', format: 'PDF', size: '1.5 MB', status: 'Ready' },
  { id: 'RPT-007', title: 'Weekly Attendance Report - Week 15', type: 'Attendance', generatedDate: '2025-01-13', generatedBy: 'Admin', format: 'Excel', size: '456 KB', status: 'Ready' },
  { id: 'RPT-008', title: 'Subject-wise Performance Comparison', type: 'Academic', generatedDate: '2025-01-17', generatedBy: 'Admin', format: 'PDF', size: '4.1 MB', status: 'Generating' },
];
