import { ReactNode } from "react";
import { cookies } from "next/headers";

import { SidebarProvider } from "@/components/shadcn/sidebar";
import { AdminSidebar } from "../../../../admin/layout/admin-sidebar";
import { AdminSidebarMobileHeader } from "../../../../admin/layout/admin-sidebar-mobile-header";

export type Props = {
   children: ReactNode;
};

export const AdminLayoutWrapper = async (props: Props) => {
   const { children } = props;
   const cookieStore = await cookies();
   const sidebarCookie = cookieStore.get("sidebar_state");
   const defaultOpen = !sidebarCookie || sidebarCookie.value === "true";

   return (
      <div className="h-full" data-testid="admin-layout-wrapper">
         <SidebarProvider defaultOpen={defaultOpen}>
            <AdminSidebar />
            <main className="flex flex-1 flex-col overflow-hidden">
               <AdminSidebarMobileHeader />
               <div className="min-h-0 flex-1">{children}</div>
            </main>
         </SidebarProvider>
      </div>
   );
};
