import { Metadata } from "next";

import { AdminDashboard } from "@/components/admin/dashboard";
import { getAdminStats } from "@/data/actions/admin/dashboard.admin.actions";

export const metadata: Metadata = { title: "Admin Dashboard" };

const AdminPage = async () => {
   const stats = await getAdminStats();
   return (
      <div className="h-full" data-testid="admin-dashboard-page">
         <AdminDashboard stats={stats} />
      </div>
   );
};

export default AdminPage;
