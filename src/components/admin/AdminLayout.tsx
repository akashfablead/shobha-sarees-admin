import { Outlet, Link } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="md:ml-64 p-6 pt-16 md:pt-6">
        <Outlet />
      </main>
    </div>
  );
}
