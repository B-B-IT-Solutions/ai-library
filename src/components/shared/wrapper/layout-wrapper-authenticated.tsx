import { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SidebarProvider } from "@/components/shadcn/sidebar";
import { Sidebar } from "@/components/shared";
import { isAuthenticated, requireUser } from "@/data/actions/auth-utils";

export type Props = {
   children: ReactNode;
};

export const AuthenticatedLayoutWrapper = async (props: Props) => {
   const { children } = props;

   const authenticated = await isAuthenticated();
   if (!authenticated) {
      return redirect("/auth/sign-in");
   }

   const user = await requireUser();
   const cookieStore = await cookies();

   const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

   return (
      <div data-testid="authenticated-layout-wrapper">
         <SidebarProvider defaultOpen={defaultOpen}>
            <Sidebar user={user} />
            <main className="flex-1">{children}</main>
         </SidebarProvider>
      </div>
   );
};
