import { Metadata } from "next";

import { AdminUsersTable } from "@/components/admin/users";
import { getAdminUsersPage } from "@/data/actions/admin/user.admin.actions";

export const metadata: Metadata = { title: "Admin – Nutzer" };

const AdminUsersPage = async () => {
   const usersPage = await getAdminUsersPage();
   return (
      <div className="container mx-auto max-w-7xl px-4 py-8" data-testid="admin-users-page">
         <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">Nutzer</h1>
            <p className="text-slate-600">{usersPage.totalElements} Nutzer gesamt</p>
         </div>
         <AdminUsersTable usersPage={usersPage} />
      </div>
   );
};

export default AdminUsersPage;
