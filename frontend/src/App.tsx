import {
  LayoutDashboard, Users, UserCheck, BookOpen, BarChart3,
  ClipboardCheck, Award, UserPlus,
} from "lucide-react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./contexts/AppContext";
import { ToastProvider } from "./contexts/ToastContext";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Layout from "./components/Layout";
import ToastContainer from "./components/ToastContainer";
import AdminPortal from "./pages/AdminPortal";
import TeacherPortal from "./pages/TeacherPortal";
import StudentPortal from "./pages/StudentPortal";

function AdminRoutes() {
  const navItems = [
    { id: "dashboard", path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "students", path: "/students", label: "Students", icon: <Users size={18} /> },
    { id: "teachers", path: "/teachers", label: "Teachers", icon: <UserCheck size={18} /> },
    { id: "subjects", path: "/subjects", label: "Subjects", icon: <BookOpen size={18} /> },
    { id: "reports", path: "/reports", label: "Reports", icon: <BarChart3 size={18} /> },
    { id: "audit-logs", path: "/audit-logs", label: "Audit Logs", icon: <ClipboardCheck size={18} /> },
    { id: "settings", path: "/settings", label: "System Settings", icon: <Award size={18} /> },
  ];
  return (
    <Routes>
      <Route element={<Layout navItems={navItems} roleLabel="Admin" roleColor="red" />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminPortal activePage="dashboard" />} />
        <Route path="/students" element={<AdminPortal activePage="students" />} />
        <Route path="/teachers" element={<AdminPortal activePage="teachers" />} />
        <Route path="/subjects" element={<AdminPortal activePage="subjects" />} />
        <Route path="/reports" element={<AdminPortal activePage="reports" />} />
        <Route path="/audit-logs" element={<AdminPortal activePage="audit-logs" />} />
        <Route path="/settings" element={<AdminPortal activePage="settings" />} />
        <Route path="/profile" element={<AdminPortal activePage="profile" />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function TeacherRoutes() {
  const navItems = [
    { id: "dashboard", path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "attendance", path: "/attendance", label: "Attendance", icon: <ClipboardCheck size={18} /> },
    { id: "marks", path: "/marks", label: "Marks", icon: <Award size={18} /> },
    { id: "students", path: "/students", label: "My Students", icon: <Users size={18} /> },
    { id: "enroll", path: "/enroll", label: "Enroll Student", icon: <UserPlus size={18} /> },
  ];
  return (
    <Routes>
      <Route element={<Layout navItems={navItems} roleLabel="Teacher" roleColor="blue" />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<TeacherPortal activePage="dashboard" />} />
        <Route path="/attendance" element={<TeacherPortal activePage="attendance" />} />
        <Route path="/marks" element={<TeacherPortal activePage="marks" />} />
        <Route path="/students" element={<TeacherPortal activePage="students" />} />
        <Route path="/enroll" element={<TeacherPortal activePage="enroll" />} />
        <Route path="/profile" element={<TeacherPortal activePage="profile" />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function StudentRoutes() {
  const navItems = [
    { id: "dashboard", path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "marks", path: "/marks", label: "My Marks", icon: <Award size={18} /> },
    { id: "attendance", path: "/attendance", label: "My Attendance", icon: <ClipboardCheck size={18} /> },
  ];
  return (
    <Routes>
      <Route element={<Layout navItems={navItems} roleLabel="Student" roleColor="green" />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<StudentPortal activePage="dashboard" />} />
        <Route path="/marks" element={<StudentPortal activePage="marks" />} />
        <Route path="/attendance" element={<StudentPortal activePage="attendance" />} />
        <Route path="/profile" element={<StudentPortal activePage="profile" />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

function AppContent() {
  const { currentUser } = useApp();

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (currentUser.role === "admin") return <AdminRoutes />;
  if (currentUser.role === "teacher") return <TeacherRoutes />;
  return <StudentRoutes />;
}

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <AppContent />
        <ToastContainer />
      </AppProvider>
    </ToastProvider>
  );
}
