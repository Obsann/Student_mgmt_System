import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useToast } from "./ToastContext";
import { api } from "../services/api";
import type {
  AppState,
  User,
  Student,
  Teacher,
  Subject,
  AttendanceRecord,
  Mark,
  Enrollment,
} from "../types";

// ============================================================
// Context Types
// ============================================================
interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;

  // Data
  state: AppState;
  isLoading: boolean;

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

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};

// ============================================================
// Provider
// ============================================================
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    users: [],
    students: [],
    teachers: [],
    subjects: [],
    enrollments: [],
    attendance: [],
    marks: [],
  });
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  // Load user from local storage on mount and fetch data
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("sms_token");
        if (token) {
          const user = await api.getMe();
          const mappedUser: User = {
            id: user._id,
            username: user.username,
            role: user.role as User["role"],
            name: user.name,
            email: user.email,
            ref_id: user.refId || "",
          };
          setCurrentUser(mappedUser);
          await loadAllData();
        }
      } catch (err) {
        console.error("Auth init failed", err);
        localStorage.removeItem("sms_token");
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const loadAllData = async () => {
    try {
      const [students, teachers, subjects, attendance, marks] = await Promise.all([
        api.getStudents(),
        api.getTeachers(),
        api.getSubjects(),
        api.getAttendance(),
        api.getAllMarks(),
      ]);
      setState({
        users: [],
        students,
        teachers,
        subjects,
        attendance,
        marks,
        enrollments: [],
      });
    } catch (err) {
      console.error("Failed to load initial data", err);
    }
  };

  // Auth
  const login = useCallback(async (username: string, password: string): Promise<string | null> => {
    try {
      const { token, user } = await api.login(username, password);
      localStorage.setItem("sms_token", token);
      
      const mappedUser: User = {
        id: user._id,
        username: user.username,
        role: user.role as User["role"],
        name: user.name,
        email: user.email,
        ref_id: user.refId || "",
      };
      
      setCurrentUser(mappedUser);
      await loadAllData();
      return null;
    } catch (err: unknown) {
      return err instanceof Error ? err.message : "Invalid username or password";
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("sms_token");
    setCurrentUser(null);
    setState({
      users: [], students: [], teachers: [], subjects: [],
      enrollments: [], attendance: [], marks: []
    });
  }, []);

  // Students CRUD
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

  // Teachers CRUD
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

  // Subjects CRUD
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

  // Attendance
  const recordAttendance = useCallback(async (records: Omit<AttendanceRecord, "id">[]) => {
    try {
      await api.recordAttendance(records);
      const updatedAttendance = await api.getAttendance(); // refresh all
      setState((prev) => ({ ...prev, attendance: updatedAttendance }));
      addToast({ type: "success", title: "Attendance Saved", message: "Attendance records saved successfully." });
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "An error occurred" });
    }
  }, [addToast]);

  // Marks
  const enterMarks = useCallback(async (marks: Omit<Mark, "id">[]) => {
    try {
      for (const m of marks) {
        await api.enterMarks(m);
      }
      // Refresh marks from server after saving
      const updatedMarks = await api.getAllMarks();
      setState((prev) => ({ ...prev, marks: updatedMarks }));
      addToast({ type: "success", title: "Marks Saved", message: "Marks entered successfully." });
    } catch (err: unknown) {
      addToast({ type: "error", title: "Error", message: err instanceof Error ? err.message : "An error occurred" });
    }
  }, [addToast]);

  const updateMark = useCallback(async (id: string, score: number) => {
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

  const getStudentsByGrade = useCallback(
    (grade: string, section?: string) =>
      state.students.filter(
        (s) => s.grade === grade && (!section || s.section === section)
      ),
    [state.students]
  );

  const getSubjectsByTeacher = useCallback(
    (teacherId: string) => state.subjects.filter((s) => s.teacher_id === teacherId),
    [state.subjects]
  );

  const getMarksForStudent = useCallback(
    (studentId: string) => state.marks.filter((m) => m.student_id === studentId),
    [state.marks]
  );

  const getAttendanceForStudent = useCallback(
    (studentId: string) => state.attendance.filter((a) => a.student_id === studentId),
    [state.attendance]
  );

  const getAttendanceForDate = useCallback(
    (subjectId: string, date: string) =>
      state.attendance.filter((a) => a.subject_id === subjectId && a.date.startsWith(date)),
    [state.attendance]
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        state,
        isLoading,
        addStudent,
        updateStudent,
        deleteStudent,
        addTeacher,
        updateTeacher,
        deleteTeacher,
        addSubject,
        updateSubject,
        deleteSubject,
        recordAttendance,
        getAttendanceForDate,
        enterMarks,
        updateMark,
        addEnrollment,
        getStudentById,
        getTeacherById,
        getSubjectById,
        getStudentsByGrade,
        getSubjectsByTeacher,
        getMarksForStudent,
        getAttendanceForStudent,
        loadAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
