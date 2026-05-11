import { useState } from "react";
import {
  LayoutDashboard, Users, UserCheck, BookOpen, BarChart3,
  ClipboardCheck, Award,
} from "lucide-react";
import { AppProvider, useApp } from "./contexts/AppContext";
import { ToastProvider } from "./contexts/ToastContext";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Layout from "./components/Layout";
import ToastContainer from "./components/ToastContainer";
import AdminPortal from "./pages/AdminPortal";
import TeacherPortal from "./pages/TeacherPortal";
import StudentPortal from "./pages/StudentPortal";

function AppContent() {
  const { currentUser } = useApp();
  const [showWelcome, setShowWelcome] = useState(true);

  if (!currentUser) {
    if (showWelcome) {
      return <Welcome onContinue={() => setShowWelcome(false)} />;
    }
    return <Login onBack={() => setShowWelcome(true)} />;
  }

  if (currentUser.role === "admin") {
    const navItems = [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
      { id: "students", label: "Students", icon: <Users size={18} /> },
      { id: "teachers", label: "Teachers", icon: <UserCheck size={18} /> },
      { id: "subjects", label: "Subjects", icon: <BookOpen size={18} /> },
      { id: "reports", label: "Reports", icon: <BarChart3 size={18} /> },
      { id: "audit-logs", label: "Audit Logs", icon: <ClipboardCheck size={18} /> },
      { id: "settings", label: "System Settings", icon: <Award size={18} /> },
    ];
    return (
      <Layout navItems={navItems} roleColor="red" roleLabel="Admin">
        {(page) => <AdminPortal activePage={page} />}
      </Layout>
    );
  }

  if (currentUser.role === "teacher") {
    const navItems = [
      { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
      { id: "attendance", label: "Attendance", icon: <ClipboardCheck size={18} /> },
      { id: "marks", label: "Marks", icon: <Award size={18} /> },
      { id: "students", label: "My Students", icon: <Users size={18} /> },
    ];
    return (
      <Layout navItems={navItems} roleColor="blue" roleLabel="Teacher">
        {(page) => <TeacherPortal activePage={page} />}
      </Layout>
    );
  }

  // Student
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { id: "marks", label: "My Marks", icon: <Award size={18} /> },
    { id: "attendance", label: "My Attendance", icon: <ClipboardCheck size={18} /> },
  ];
  return (
    <Layout navItems={navItems} roleColor="green" roleLabel="Student">
      {(page) => <StudentPortal activePage={page} />}
    </Layout>
  );
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
