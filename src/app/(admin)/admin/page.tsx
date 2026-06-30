import { Metadata } from "next";

import { AdminDashboard } from "@/components/admin/dashboard";
import { getAdminStats } from "@/data/actions/admin/dashboard.admin.actions";

export const metadata: Metadata = { title: "Admin Dashboard" };

const AdminPage = async () => {
   const stats = await getAdminStats();
   return (
      <div className="container mx-auto max-w-7xl px-4 py-8" data-testid="admin-dashboard-page">
         <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-600">Plattformübersicht</p>
         </div>
         <AdminDashboard stats={stats} />
      </div>
   );
};

export default AdminPage;
