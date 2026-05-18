import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="ml-64">
        <AdminHeader title="Kera Highschool Admin" subtitle="Jimma City, Oromia, Ethiopia" />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
