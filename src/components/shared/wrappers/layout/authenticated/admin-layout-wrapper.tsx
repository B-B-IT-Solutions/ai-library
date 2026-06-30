import { ReactNode } from "react";
import { cookies } from "next/headers";

import { SidebarProvider } from "@/components/shadcn/sidebar";
import {
   AdminSidebar,
   AdminSidebarMobileHeader,
} from "@/components/shared/sidebar/admin";
import { requireAdmin } from "@/data/actions/auth-utils";

export type Props = {
   children: ReactNode;
};

export const AuthenticatedAdminLayoutWrapper = async (props: Props) => {
   const { children } = props;

   const admin = await requireAdmin();
   const cookieStore = await cookies();

   const sidebarCookie = cookieStore.get("sidebar_state");
   const defaultOpen = !sidebarCookie || sidebarCookie.value === "true";

   return (
      <div className="h-full" data-testid="authenticated-admin-layout-wrapper">
         <SidebarProvider
            defaultOpen={defaultOpen}
            data-testid="sidebar-wrapper"
         >
            <AdminSidebar user={admin} />
            <main className="flex flex-1 flex-col overflow-hidden">
               <AdminSidebarMobileHeader />
               <div className="min-h-0 flex-1">{children}</div>
            </main>
         </SidebarProvider>
      </div>
   );
};
