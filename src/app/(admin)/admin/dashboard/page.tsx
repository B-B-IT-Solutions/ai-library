import { Metadata } from "next";

import { AdminDashboard } from "@/components/admin/dashboard";

export const metadata: Metadata = {
   title: "Admin Dashboard",
};

export const AdminDashboardPage = async () => {
   return (
      <div className="h-full" data-testid="admin-dashboard-page">
         <AdminDashboard />
      </div>
   );
};

export default AdminDashboardPage;
