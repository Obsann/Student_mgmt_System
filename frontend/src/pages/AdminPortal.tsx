import ProfilePage from "./ProfilePage";
import AdminDashboard from "./admin/AdminDashboard";
import ManageStudents from "./admin/ManageStudents";
import ManageTeachers from "./admin/ManageTeachers";
import ManageSubjects from "./admin/ManageSubjects";
import AdminReports from "./admin/AdminReports";
import AdminAuditLogs from "./admin/AdminAuditLogs";
import AdminSettings from "./admin/AdminSettings";
import PendingEnrollments from "./admin/PendingEnrollments";

export default function AdminPortal({ activePage }: { activePage: string }) {
  switch (activePage) {
    case "dashboard": return <AdminDashboard />;
    case "students": return <ManageStudents />;
    case "teachers": return <ManageTeachers />;
    case "subjects": return <ManageSubjects />;
    case "reports": return <AdminReports />;
    case "audit-logs": return <AdminAuditLogs />;
    case "settings": return <AdminSettings />;
    case "pending-enrollments": return <PendingEnrollments />;
    case "profile": return <ProfilePage />;
    default: return <AdminDashboard />;
  }
}
