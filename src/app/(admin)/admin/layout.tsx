import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminLayoutWrapper } from "@/components/admin/layout";

export type AdminLayoutProps = {
   children: ReactNode;
};

const AdminLayout = async (props: Readonly<AdminLayoutProps>) => {
   const { children } = props;
   const session = await auth();

   if (!session?.user?.id) {
      return redirect("/auth/sign-in");
   }
   if (session.user.role !== "admin") {
      return redirect("/");
   }

   return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>;
};

export default AdminLayout;
