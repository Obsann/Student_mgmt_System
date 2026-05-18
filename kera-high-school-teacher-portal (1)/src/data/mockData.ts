// Mock data for Kera Highschool Teachers Portal

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  grade: string;
  section: string;
  age: number;
  gender: 'Male' | 'Female';
  parentName: string;
  phone: string;
  address: string;
  email: string;
  enrollmentDate: string;
  photo: string;
}

export interface AttendanceRecord {
  studentId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Excused';
}

export interface MarkRecord {
  studentId: string;
  subject: string;
  examType: 'Quiz' | 'Midterm' | 'Final' | 'Assignment';
  mark: number;
  totalMark: number;
  semester: string;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  subjects: string[];
  qualification: string;
  experience: number;
  joinDate: string;
  salary: string;
  emergencyContact: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  bloodGroup: string;
  photo: string;
}

export const teacherData: Teacher = {
  id: 'T-2024-001',
  firstName: 'Dereje',
  lastName: 'Bekele',
  email: 'dereje.bekele@kerahighschool.edu.et',
  phone: '+251 913 456 789',
  address: 'Jimma, Oromia, Ethiopia',
  department: 'Natural Science',
  subjects: ['Mathematics', 'Physics'],
  qualification: 'MSc in Applied Mathematics',
  experience: 8,
  joinDate: '2017-09-15',
  salary: '18,500 ETB',
  emergencyContact: '+251 911 234 567',
  gender: 'Male',
  dateOfBirth: '1988-03-22',
  bloodGroup: 'O+',
  photo: '',
};

export const students: Student[] = [
  { id: 'S-2024-001', firstName: 'Abebe', lastName: 'Girma', grade: '9', section: 'A', age: 15, gender: 'Male', parentName: 'Girma Tadesse', phone: '+251 912 345 678', address: 'Jimma, Kochi', email: 'abebe.g@student.kerahighschool.edu.et', enrollmentDate: '2024-09-01', photo: '' },
  { id: 'S-2024-002', firstName: 'Tigist', lastName: 'Haile', grade: '9', section: 'A', age: 14, gender: 'Female', parentName: 'Haile Wolde', phone: '+251 913 456 789', address: 'Jimma, Hermata', email: 'tigist.h@student.kerahighschool.edu.et', enrollmentDate: '2024-09-01', photo: '' },
  { id: 'S-2024-003', firstName: 'Yonas', lastName: 'Alemu', grade: '9', section: 'A', age: 16, gender: 'Male', parentName: 'Alemu Kassa', phone: '+251 914 567 890', address: 'Jimma, Bosa', email: 'yonas.a@student.kerahighschool.edu.et', enrollmentDate: '2024-09-01', photo: '' },
  { id: 'S-2024-004', firstName: 'Meron', lastName: 'Dinkessa', grade: '9', section: 'A', age: 15, gender: 'Female', parentName: 'Dinkessa Feyisa', phone: '+251 915 678 901', address: 'Jimma, Seto', email: 'meron.d@student.kerahighschool.edu.et', enrollmentDate: '2024-09-01', photo: '' },
  { id: 'S-2024-005', firstName: 'Solomon', lastName: 'Edosa', grade: '9', section: 'B', age: 16, gender: 'Male', parentName: 'Edosa Tesfaye', phone: '+251 916 789 012', address: 'Jimma, Mendera', email: 'solomon.e@student.kerahighschool.edu.et', enrollmentDate: '2024-09-01', photo: '' },
  { id: 'S-2024-006', firstName: 'Helen', lastName: 'Fikadu', grade: '9', section: 'B', age: 15, gender: 'Female', parentName: 'Fikadu Gabisa', phone: '+251 917 890 123', address: 'Jimma, Kochi', email: 'helen.f@student.kerahighschool.edu.et', enrollmentDate: '2024-09-01', photo: '' },
  { id: 'S-2024-007', firstName: 'Binyam', lastName: 'Gashaw', grade: '10', section: 'A', age: 16, gender: 'Male', parentName: 'Gashaw Mekonnen', phone: '+251 918 901 234', address: 'Jimma, Hermata', email: 'binyam.g@student.kerahighschool.edu.et', enrollmentDate: '2023-09-01', photo: '' },
  { id: 'S-2024-008', firstName: 'Sara', lastName: 'Hussein', grade: '10', section: 'A', age: 17, gender: 'Female', parentName: 'Hussein Abdo', phone: '+251 919 012 345', address: 'Jimma, Bosa', email: 'sara.h@student.kerahighschool.edu.et', enrollmentDate: '2023-09-01', photo: '' },
  { id: 'S-2024-009', firstName: 'Natnael', lastName: 'Indris', grade: '10', section: 'A', age: 17, gender: 'Male', parentName: 'Indris Jemal', phone: '+251 911 123 456', address: 'Jimma, Seto', email: 'natnael.i@student.kerahighschool.edu.et', enrollmentDate: '2023-09-01', photo: '' },
  { id: 'S-2024-010', firstName: 'Kidist', lastName: 'Jemal', grade: '10', section: 'B', age: 16, gender: 'Female', parentName: 'Jemal Kemal', phone: '+251 912 234 567', address: 'Jimma, Mendera', email: 'kidist.j@student.kerahighschool.edu.et', enrollmentDate: '2023-09-01', photo: '' },
  { id: 'S-2024-011', firstName: 'Abel', lastName: 'Kefale', grade: '9', section: 'A', age: 15, gender: 'Male', parentName: 'Kefale Lelisa', phone: '+251 913 345 678', address: 'Jimma, Kochi', email: 'abel.k@student.kerahighschool.edu.et', enrollmentDate: '2024-09-01', photo: '' },
  { id: 'S-2024-012', firstName: 'Feven', lastName: 'Lemesa', grade: '9', section: 'B', age: 14, gender: 'Female', parentName: 'Lemesa Megersa', phone: '+251 914 456 789', address: 'Jimma, Hermata', email: 'feven.l@student.kerahighschool.edu.et', enrollmentDate: '2024-09-01', photo: '' },
  { id: 'S-2024-013', firstName: 'Samuel', lastName: 'Mulugeta', grade: '10', section: 'A', age: 17, gender: 'Male', parentName: 'Mulugeta Negash', phone: '+251 915 567 890', address: 'Jimma, Bosa', email: 'samuel.m@student.kerahighschool.edu.et', enrollmentDate: '2023-09-01', photo: '' },
  { id: 'S-2024-014', firstName: 'Bethel', lastName: 'Negash', grade: '10', section: 'B', age: 16, gender: 'Female', parentName: 'Negash Obsa', phone: '+251 916 678 901', address: 'Jimma, Seto', email: 'bethel.n@student.kerahighschool.edu.et', enrollmentDate: '2023-09-01', photo: '' },
  { id: 'S-2024-015', firstName: 'Eyob', lastName: 'Obsa', grade: '9', section: 'A', age: 16, gender: 'Male', parentName: 'Obsa Petros', phone: '+251 917 789 012', address: 'Jimma, Mendera', email: 'eyob.o@student.kerahighschool.edu.et', enrollmentDate: '2024-09-01', photo: '' },
  { id: 'S-2024-016', firstName: 'Hanna', lastName: 'Petros', grade: '9', section: 'B', age: 15, gender: 'Female', parentName: 'Petros Regassa', phone: '+251 918 890 123', address: 'Jimma, Kochi', email: 'hanna.p@student.kerahighschool.edu.et', enrollmentDate: '2024-09-01', photo: '' },
  { id: 'S-2024-017', firstName: 'Dawit', lastName: 'Regassa', grade: '10', section: 'B', age: 17, gender: 'Male', parentName: 'Regassa Shiferaw', phone: '+251 919 901 234', address: 'Jimma, Hermata', email: 'dawit.r@student.kerahighschool.edu.et', enrollmentDate: '2023-09-01', photo: '' },
  { id: 'S-2024-018', firstName: 'Lidya', lastName: 'Shiferaw', grade: '9', section: 'A', age: 14, gender: 'Female', parentName: 'Shiferaw Tadesse', phone: '+251 911 012 345', address: 'Jimma, Bosa', email: 'lidya.s@student.kerahighschool.edu.et', enrollmentDate: '2024-09-01', photo: '' },
  { id: 'S-2024-019', firstName: 'Nahom', lastName: 'Tadesse', grade: '10', section: 'A', age: 16, gender: 'Male', parentName: 'Tadesse Urgessa', phone: '+251 912 123 456', address: 'Jimma, Seto', email: 'nahom.t@student.kerahighschool.edu.et', enrollmentDate: '2023-09-01', photo: '' },
  { id: 'S-2024-020', firstName: 'Selam', lastName: 'Urgessa', grade: '9', section: 'B', age: 15, gender: 'Female', parentName: 'Urgessa Wondimu', phone: '+251 913 234 567', address: 'Jimma, Mendera', email: 'selam.u@student.kerahighschool.edu.et', enrollmentDate: '2024-09-01', photo: '' },
];

export const attendanceRecords: AttendanceRecord[] = [
  // Generate attendance for the past 2 weeks
  ...generateAttendance('2025-01-06'),
  ...generateAttendance('2025-01-07'),
  ...generateAttendance('2025-01-08'),
  ...generateAttendance('2025-01-09'),
  ...generateAttendance('2025-01-10'),
  ...generateAttendance('2025-01-13'),
  ...generateAttendance('2025-01-14'),
  ...generateAttendance('2025-01-15'),
  ...generateAttendance('2025-01-16'),
  ...generateAttendance('2025-01-17'),
];

function generateAttendance(date: string): AttendanceRecord[] {
  const statuses: ('Present' | 'Absent' | 'Late' | 'Excused')[] = ['Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Present', 'Absent', 'Late', 'Excused'];
  return students.slice(0, 10).map(s => ({
    studentId: s.id,
    date,
    status: statuses[Math.floor(Math.random() * statuses.length)],
  }));
}

export const markRecords: MarkRecord[] = [
  // Quiz marks for Grade 9A
  { studentId: 'S-2024-001', subject: 'Mathematics', examType: 'Quiz', mark: 18, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-002', subject: 'Mathematics', examType: 'Quiz', mark: 16, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-003', subject: 'Mathematics', examType: 'Quiz', mark: 14, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-004', subject: 'Mathematics', examType: 'Quiz', mark: 19, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-011', subject: 'Mathematics', examType: 'Quiz', mark: 17, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-015', subject: 'Mathematics', examType: 'Quiz', mark: 15, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-018', subject: 'Mathematics', examType: 'Quiz', mark: 13, totalMark: 20, semester: 'Semester 1' },
  // Midterm marks for Grade 9A
  { studentId: 'S-2024-001', subject: 'Mathematics', examType: 'Midterm', mark: 42, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-002', subject: 'Mathematics', examType: 'Midterm', mark: 38, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-003', subject: 'Mathematics', examType: 'Midterm', mark: 35, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-004', subject: 'Mathematics', examType: 'Midterm', mark: 45, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-011', subject: 'Mathematics', examType: 'Midterm', mark: 40, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-015', subject: 'Mathematics', examType: 'Midterm', mark: 33, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-018', subject: 'Mathematics', examType: 'Midterm', mark: 30, totalMark: 50, semester: 'Semester 1' },
  // Physics marks
  { studentId: 'S-2024-001', subject: 'Physics', examType: 'Quiz', mark: 17, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-002', subject: 'Physics', examType: 'Quiz', mark: 15, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-003', subject: 'Physics', examType: 'Quiz', mark: 18, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-004', subject: 'Physics', examType: 'Quiz', mark: 16, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-011', subject: 'Physics', examType: 'Quiz', mark: 14, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-015', subject: 'Physics', examType: 'Quiz', mark: 19, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-018', subject: 'Physics', examType: 'Quiz', mark: 12, totalMark: 20, semester: 'Semester 1' },
  // Midterm Physics
  { studentId: 'S-2024-001', subject: 'Physics', examType: 'Midterm', mark: 40, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-002', subject: 'Physics', examType: 'Midterm', mark: 36, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-003', subject: 'Physics', examType: 'Midterm', mark: 43, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-004', subject: 'Physics', examType: 'Midterm', mark: 41, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-011', subject: 'Physics', examType: 'Midterm', mark: 35, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-015', subject: 'Physics', examType: 'Midterm', mark: 44, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-018', subject: 'Physics', examType: 'Midterm', mark: 28, totalMark: 50, semester: 'Semester 1' },
  // Grade 10 marks
  { studentId: 'S-2024-007', subject: 'Mathematics', examType: 'Quiz', mark: 19, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-008', subject: 'Mathematics', examType: 'Quiz', mark: 17, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-009', subject: 'Mathematics', examType: 'Quiz', mark: 16, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-013', subject: 'Mathematics', examType: 'Quiz', mark: 14, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-019', subject: 'Mathematics', examType: 'Quiz', mark: 18, totalMark: 20, semester: 'Semester 1' },
  { studentId: 'S-2024-007', subject: 'Mathematics', examType: 'Midterm', mark: 44, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-008', subject: 'Mathematics', examType: 'Midterm', mark: 40, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-009', subject: 'Mathematics', examType: 'Midterm', mark: 38, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-013', subject: 'Mathematics', examType: 'Midterm', mark: 32, totalMark: 50, semester: 'Semester 1' },
  { studentId: 'S-2024-019', subject: 'Mathematics', examType: 'Midterm', mark: 42, totalMark: 50, semester: 'Semester 1' },
];

export const notifications = [
  { id: 1, title: 'Staff Meeting', message: 'Monthly staff meeting scheduled for January 20, 2025 at 2:00 PM in the conference hall.', date: '2025-01-15', type: 'meeting' as const },
  { id: 2, title: 'Exam Schedule Published', message: 'Final exam schedule for Semester 1 has been published. Please review your invigilation duties.', date: '2025-01-14', type: 'exam' as const },
  { id: 3, title: 'Grade Submission Deadline', message: 'All semester 1 grades must be submitted by January 30, 2025.', date: '2025-01-13', type: 'deadline' as const },
  { id: 4, title: 'Parent-Teacher Conference', message: 'Parent-teacher conference scheduled for February 5, 2025. Prepare student progress reports.', date: '2025-01-12', type: 'meeting' as const },
  { id: 5, title: 'Professional Development', message: 'Workshop on new teaching methodologies on January 25, 2025.', date: '2025-01-10', type: 'event' as const },
];

export const timetable = [
  { day: 'Monday', periods: [
    { time: '8:00 - 8:45', subject: 'Mathematics', grade: '9A', room: 'Room 101' },
    { time: '8:50 - 9:35', subject: 'Mathematics', grade: '9B', room: 'Room 102' },
    { time: '9:40 - 10:25', subject: 'Physics', grade: '10A', room: 'Lab 1' },
    { time: '10:40 - 11:25', subject: 'Free Period', grade: '-', room: '-' },
    { time: '11:30 - 12:15', subject: 'Mathematics', grade: '10A', room: 'Room 201' },
    { time: '1:00 - 1:45', subject: 'Physics', grade: '9A', room: 'Lab 1' },
    { time: '1:50 - 2:35', subject: 'Free Period', grade: '-', room: '-' },
  ]},
  { day: 'Tuesday', periods: [
    { time: '8:00 - 8:45', subject: 'Physics', grade: '9B', room: 'Lab 1' },
    { time: '8:50 - 9:35', subject: 'Mathematics', grade: '10A', room: 'Room 201' },
    { time: '9:40 - 10:25', subject: 'Free Period', grade: '-', room: '-' },
    { time: '10:40 - 11:25', subject: 'Mathematics', grade: '9A', room: 'Room 101' },
    { time: '11:30 - 12:15', subject: 'Physics', grade: '10B', room: 'Lab 1' },
    { time: '1:00 - 1:45', subject: 'Free Period', grade: '-', room: '-' },
    { time: '1:50 - 2:35', subject: 'Mathematics', grade: '10B', room: 'Room 202' },
  ]},
  { day: 'Wednesday', periods: [
    { time: '8:00 - 8:45', subject: 'Free Period', grade: '-', room: '-' },
    { time: '8:50 - 9:35', subject: 'Mathematics', grade: '9A', room: 'Room 101' },
    { time: '9:40 - 10:25', subject: 'Physics', grade: '9A', room: 'Lab 1' },
    { time: '10:40 - 11:25', subject: 'Mathematics', grade: '10B', room: 'Room 202' },
    { time: '11:30 - 12:15', subject: 'Free Period', grade: '-', room: '-' },
    { time: '1:00 - 1:45', subject: 'Physics', grade: '10A', room: 'Lab 1' },
    { time: '1:50 - 2:35', subject: 'Mathematics', grade: '9B', room: 'Room 102' },
  ]},
  { day: 'Thursday', periods: [
    { time: '8:00 - 8:45', subject: 'Physics', grade: '10B', room: 'Lab 1' },
    { time: '8:50 - 9:35', subject: 'Free Period', grade: '-', room: '-' },
    { time: '9:40 - 10:25', subject: 'Mathematics', grade: '10A', room: 'Room 201' },
    { time: '10:40 - 11:25', subject: 'Mathematics', grade: '9B', room: 'Room 102' },
    { time: '11:30 - 12:15', subject: 'Physics', grade: '9B', room: 'Lab 1' },
    { time: '1:00 - 1:45', subject: 'Free Period', grade: '-', room: '-' },
    { time: '1:50 - 2:35', subject: 'Mathematics', grade: '9A', room: 'Room 101' },
  ]},
  { day: 'Friday', periods: [
    { time: '8:00 - 8:45', subject: 'Mathematics', grade: '9A', room: 'Room 101' },
    { time: '8:50 - 9:35', subject: 'Physics', grade: '9A', room: 'Lab 1' },
    { time: '9:40 - 10:25', subject: 'Mathematics', grade: '9B', room: 'Room 102' },
    { time: '10:40 - 11:25', subject: 'Free Period', grade: '-', room: '-' },
    { time: '11:30 - 12:15', subject: 'Physics', grade: '10A', room: 'Lab 1' },
    { time: '1:00 - 1:45', subject: 'Mathematics', grade: '10B', room: 'Room 202' },
    { time: '1:50 - 2:35', subject: 'Free Period', grade: '-', room: '-' },
  ]},
];
