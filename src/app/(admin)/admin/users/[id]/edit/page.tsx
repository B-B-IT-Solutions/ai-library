import { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminUserEdit } from "@/components/admin/users";
import { getAdminUser } from "@/data/actions/admin/users";

export const metadata: Metadata = {
   title: "Admin – Nutzer Bearbeiten",
};

export type PageParams = {
   id: string;
};

export type PageProps = {
   params: Promise<PageParams>;
};

export const EditAdminUserPage = async ({ params }: PageProps) => {
   const { id } = await params;

   const user = await getAdminUser(id);

   if (!user) {
      return notFound();
   }

   return (
      <div data-testid="edit-admin-user-page">
         <AdminUserEdit user={user} />
      </div>
   );
};

export default EditAdminUserPage;
