import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useToast } from "./ToastContext";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";
import type { AppState, Student, Teacher, Subject, AttendanceRecord, Mark, Enrollment } from "../types";

interface DataContextType {
  state: AppState;
  
  // Students
  addStudent: (s: Omit<Student, "id">) => Promise<void>;
  updateStudent: (id: string, s: Partial<Student>) => Promise<void>;
  deleteStudent: (id: string) => Promise<void>;

  // Teachers
  addTeacher: (t: Omit<Teacher, "id">) => Promise<void>;
  updateTeacher: (id: string, t: Partial<Teacher>) => Promise<void>;
  deleteTeacher: (id: string) => Promise<void>;

  // Subjects
  addSubject: (s: Omit<Subject, "id">) => Promise<void>;
  updateSubject: (id: string, s: Partial<Subject>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;

  // Attendance
  recordAttendance: (records: Omit<AttendanceRecord, "id">[]) => Promise<void>;
  getAttendanceForDate: (subjectId: string, date: string) => AttendanceRecord[];

  // Marks
  enterMarks: (marks: Omit<Mark, "id">[]) => Promise<void>;
  updateMark: (id: string, score: number) => Promise<void>;

  // Enrollments
  addEnrollment: (e: Omit<Enrollment, "id">) => void;

  // Helpers
  getStudentById: (id: string) => Student | undefined;
  getTeacherById: (id: string) => Teacher | undefined;
  getSubjectById: (id: string) => Subject | undefined;
  getStudentsByGrade: (grade: string, section?: string) => Student[];
  getSubjectsByTeacher: (teacherId: string) => Subject[];
  getMarksForStudent: (studentId: string) => Mark[];
  getAttendanceForStudent: (studentId: string) => AttendanceRecord[];
  
  loadAllData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const [state, setState] = useState<AppState>({
    users: [],
    students: [],
    teachers: [],
    subjects: [],
    enrollments: [],
    attendance: [],
    marks: [],
  });

  const loadAllData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [studentsRes, teachersRes, subjectsRes, attendance, marks] = await Promise.all([
        api.getStudents({ limit: 1000 }), // temporary large limit until dashboards use aggregated stats API
        api.getTeachers({ limit: 1000 }),
        api.getSubjects({ limit: 1000 }),
        api.getAttendance(),
        api.getAllMarks(),
      ]);
      setState({
        users: [],
        students: studentsRes.data,
        teachers: teachersRes.data,
        subjects: subjectsRes.data,
        attendance,
        marks,
        enrollments: [],
      });
    } catch (err) {
      console.error("Failed to load data", err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    } else {
      // Clear data on logout
      setState({ users: [], students: [], teachers: [], subjects: [], enrollments: [], attendance: [], marks: [] });
    }
  }, [isAuthenticated, loadAllData]);

  // Refresh on focus
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        loadAllData();
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isAuthenticated, loadAllData]);

  // CRUD implementations
  const addStudent = useCallback(async (s: Omit<Student, "id">) => {
    try {
      const newStudent = await api.createStudent(s);
      setState((prev) => ({ ...prev, students: [...prev.students, newStudent] }));
      addToast({ type: "success", title: "Student Added", message: `${s.first_name} has been added.` });
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "An error occurred" });
    }
  }, [addToast]);

  const updateStudent = useCallback(async (id: string, data: Partial<Student>) => {
    try {
      const updated = await api.updateStudent(id, data);
      setState((prev) => ({
        ...prev,
        students: prev.students.map((s) => (s.id === id ? updated : s)),
      }));
      addToast({ type: "success", title: "Student Updated", message: "Student information updated." });
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "An error occurred" });
    }
  }, [addToast]);

  const deleteStudent = useCallback(async (id: string) => {
    try {
      await api.deleteStudent(id);
      setState((prev) => ({
        ...prev,
        students: prev.students.filter((s) => s.id !== id),
      }));
      addToast({ type: "success", title: "Student Deleted", message: "Student removed." });
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "An error occurred" });
    }
  }, [addToast]);

  const addTeacher = useCallback(async (t: Omit<Teacher, "id">) => {
    try {
      const newTeacher = await api.createTeacher(t);
      setState((prev) => ({ ...prev, teachers: [...prev.teachers, newTeacher] }));
      addToast({ type: "success", title: "Teacher Added", message: `${t.name} has been added.` });
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "An error occurred" });
    }
  }, [addToast]);

  const updateTeacher = useCallback(async (id: string, data: Partial<Teacher>) => {
    try {
      const updated = await api.updateTeacher(id, data);
      setState((prev) => ({
        ...prev,
        teachers: prev.teachers.map((t) => (t.id === id ? updated : t)),
      }));
      addToast({ type: "success", title: "Teacher Updated", message: "Teacher information updated." });
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "An error occurred" });
    }
  }, [addToast]);

  const deleteTeacher = useCallback(async (id: string) => {
    try {
      await api.deleteTeacher(id);
      setState((prev) => ({
        ...prev,
        teachers: prev.teachers.filter((t) => t.id !== id),
      }));
      addToast({ type: "success", title: "Teacher Deleted", message: "Teacher removed." });
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "An error occurred" });
    }
  }, [addToast]);

  const addSubject = useCallback(async (s: Omit<Subject, "id">) => {
    try {
      const newSubject = await api.createSubject(s);
      setState((prev) => ({ ...prev, subjects: [...prev.subjects, newSubject] }));
      addToast({ type: "success", title: "Subject Added", message: `${s.name} has been added.` });
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "An error occurred" });
    }
  }, [addToast]);

  const updateSubject = useCallback(async (id: string, data: Partial<Subject>) => {
    try {
      const updated = await api.updateSubject(id, data);
      setState((prev) => ({
        ...prev,
        subjects: prev.subjects.map((s) => (s.id === id ? updated : s)),
      }));
      addToast({ type: "success", title: "Subject Updated", message: "Subject updated." });
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "An error occurred" });
    }
  }, [addToast]);

  const deleteSubject = useCallback(async (id: string) => {
    try {
      await api.deleteSubject(id);
      setState((prev) => ({
        ...prev,
        subjects: prev.subjects.filter((s) => s.id !== id),
      }));
      addToast({ type: "success", title: "Subject Deleted", message: "Subject removed." });
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "An error occurred" });
    }
  }, [addToast]);

  const recordAttendance = useCallback(async (records: Omit<AttendanceRecord, "id">[]) => {
    try {
      await api.recordAttendance(records);
      const updatedAttendance = await api.getAttendance();
      setState((prev) => ({ ...prev, attendance: updatedAttendance }));
      addToast({ type: "success", title: "Attendance Saved", message: "Attendance records saved successfully." });
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "An error occurred" });
    }
  }, [addToast]);

  const enterMarks = useCallback(async (marks: Omit<Mark, "id">[]) => {
    try {
      for (const m of marks) {
        await api.enterMarks(m);
      }
      const updatedMarks = await api.getAllMarks();
      setState((prev) => ({ ...prev, marks: updatedMarks }));
      addToast({ type: "success", title: "Marks Saved", message: "Marks entered successfully." });
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "An error occurred" });
    }
  }, [addToast]);

  const updateMark = useCallback(async (_id: string, score: number) => {
    try {
      await api.enterMarks({ student_id: '', subject_id: '', academic_year: '', semester: 1, assessment_type: 'quiz' as const, score, max_score: 100, entered_by: '', remarks: '' });
      addToast({ type: "success", title: "Mark Updated", message: "Mark updated successfully." });
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "An error occurred" });
    }
  }, [addToast]);

  const addEnrollment = useCallback((_e: Omit<Enrollment, "id">) => {}, []);

  // Helpers
  const getStudentById = useCallback((id: string) => state.students.find((s) => s.id === id), [state.students]);
  const getTeacherById = useCallback((id: string) => state.teachers.find((t) => t.id === id), [state.teachers]);
  const getSubjectById = useCallback((id: string) => state.subjects.find((s) => s.id === id), [state.subjects]);
  const getStudentsByGrade = useCallback((grade: string, section?: string) => state.students.filter((s) => s.grade === grade && (!section || s.section === section)), [state.students]);
  const getSubjectsByTeacher = useCallback((teacherId: string) => state.subjects.filter((s) => s.teacher_id === teacherId), [state.subjects]);
  const getMarksForStudent = useCallback((studentId: string) => state.marks.filter((m) => m.student_id === studentId), [state.marks]);
  const getAttendanceForStudent = useCallback((studentId: string) => state.attendance.filter((a) => a.student_id === studentId), [state.attendance]);
  const getAttendanceForDate = useCallback((subjectId: string, date: string) => {
    const [year, month, day] = date.split("-").map(Number);
    return state.attendance.filter((a) => {
      const aDate = new Date(a.date);
      return a.subject_id === subjectId &&
             aDate.getFullYear() === year &&
             aDate.getMonth() === (month - 1) &&
             aDate.getDate() === day;
    });
  }, [state.attendance]);

  return (
    <DataContext.Provider value={{
      state, addStudent, updateStudent, deleteStudent,
      addTeacher, updateTeacher, deleteTeacher,
      addSubject, updateSubject, deleteSubject,
      recordAttendance, getAttendanceForDate,
      enterMarks, updateMark, addEnrollment,
      getStudentById, getTeacherById, getSubjectById,
      getStudentsByGrade, getSubjectsByTeacher,
      getMarksForStudent, getAttendanceForStudent,
      loadAllData
    }}>
      {children}
    </DataContext.Provider>
  );
}
