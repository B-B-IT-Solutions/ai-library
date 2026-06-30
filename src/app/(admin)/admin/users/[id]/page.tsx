import { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminUserDetail } from "@/components/admin/users";
import { getAdminUserDetail } from "@/data/actions/admin/user.admin.actions";

export const metadata: Metadata = { title: "Admin – Nutzerdetail" };

type Props = {
   params: Promise<{ id: string }>;
};

const AdminUserDetailPage = async (props: Props) => {
   const { id } = await props.params;

   const user = await getAdminUserDetail(id);

   if (!user) {
      return notFound();
   }
   return (
      <div
         className="container mx-auto max-w-7xl px-4 py-8"
         data-testid="admin-user-detail-page"
      >
         <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
               {user.name}
            </h1>
            <p className="text-slate-600">{user.email}</p>
         </div>
         <AdminUserDetail user={user} />
      </div>
   );
};

export default AdminUserDetailPage;
