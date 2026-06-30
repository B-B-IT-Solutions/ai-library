import { getAdminUsersPage } from "@/data/actions/admin/user.admin.actions";

import { AdminUsersTable } from "./admin-users-table";

export const AdminUsers = async () => {
   const usersPage = await getAdminUsersPage();

   return (
      <div
         className="container mx-auto max-w-7xl px-4 py-8"
         data-testid="admin-users"
      >
         <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">Nutzer</h1>
            <p className="text-slate-600">{usersPage.totalElements} Nutzer gesamt</p>
         </div>
         <AdminUsersTable usersPage={usersPage} />
      </div>
   );
};
