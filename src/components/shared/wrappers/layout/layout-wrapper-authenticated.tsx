import { ReactNode } from "react";
import { cookies } from "next/headers";

import { SidebarProvider } from "@/components/shadcn/sidebar";
import { Sidebar } from "@/components/shared";
import { requireUser } from "@/data/actions/auth-utils";

export type Props = {
   children: ReactNode;
};

export const AuthenticatedLayoutWrapper = async (props: Props) => {
   const { children } = props;

   const user = await requireUser();
   const cookieStore = await cookies();

   const sidebarCookie = cookieStore.get("sidebar_state");
   const defaultOpen = !sidebarCookie || sidebarCookie.value === "true";

   return (
      <div className="h-full" data-testid="authenticated-layout-wrapper">
         <SidebarProvider
            defaultOpen={defaultOpen}
            data-testid="sidebar-wrapper"
         >
            <Sidebar user={user} />
            <main className="flex-1">{children}</main>
         </SidebarProvider>
      </div>
   );
};
