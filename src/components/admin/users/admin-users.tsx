import { getAdminUsersPage } from "@/data/actions/admin/users";

import { UsersTable } from "./lists";

export const AdminUsers = async () => {
   const users = await getAdminUsersPage();

   return (
      <div
         className="container mx-auto max-w-7xl px-4 py-8"
         data-testid="admin-users"
      >
         <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">Nutzer</h1>
            <p className="text-slate-600">
               {users.totalElements} Nutzer gesamt
            </p>
         </div>
         <UsersTable users={users} />
      </div>
   );
};
