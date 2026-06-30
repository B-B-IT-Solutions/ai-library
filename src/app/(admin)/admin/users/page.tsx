import { Metadata } from "next";

import { AdminUsers } from "@/components/admin/users";

export const metadata: Metadata = { title: "Admin – Nutzer" };

const AdminUsersPage = async () => {
   return (
      <div className="h-full" data-testid="admin-users-page">
         <AdminUsers />
      </div>
   );
};

export default AdminUsersPage;
