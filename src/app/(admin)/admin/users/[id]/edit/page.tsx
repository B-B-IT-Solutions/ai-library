import { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminUserEdit } from "@/components/admin/users";
import { getAdminUser } from "@/data/actions/admin/user.admin.actions";

export const metadata: Metadata = { title: "Admin – Nutzerdetail" };

type PageParams = {
   id: string;
};

type PageProps = {
   params: Promise<PageParams>;
};

export const EditAdminUserPage = async ({ params }: PageProps) => {
   const { id } = await params;

   const user = await getAdminUser(id);

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
         <AdminUserEdit user={user} />
      </div>
   );
};

export default EditAdminUserPage;
