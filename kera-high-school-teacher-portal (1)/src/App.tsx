import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Attendance from './pages/Attendance';
import Marks from './pages/Marks';
import MyStudents from './pages/MyStudents';
import Registration from './pages/Registration';
import AdminDashboard from './pages/admin/Dashboard';
import PendingEnrollments from './pages/admin/PendingEnrollments';
import AdminStudents from './pages/admin/Students';
import AdminTeachers from './pages/admin/Teachers';
import AdminSubjects from './pages/admin/Subjects';
import Reports from './pages/admin/Reports';
import AuditLogs from './pages/admin/AuditLogs';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Teacher Portal */}
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/marks" element={<Marks />} />
          <Route path="/students" element={<MyStudents />} />
          <Route path="/registration" element={<Registration />} />
        </Route>

        {/* Admin Portal */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="enrollments" element={<PendingEnrollments />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="teachers" element={<AdminTeachers />} />
          <Route path="subjects" element={<AdminSubjects />} />
          <Route path="reports" element={<Reports />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
