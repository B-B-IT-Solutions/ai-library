import { ReactNode } from "react";
import { cookies, headers } from "next/headers";

import { SidebarProvider } from "@/components/shadcn/sidebar";
import { Sidebar } from "@/components/shared";
import { TrialBanner, TrialExpiredGate } from "@/components/subscription";
import { requireUser } from "@/data/actions/auth-utils";
import {
   getHasActiveAccess,
   getTrialStatus,
} from "@/data/actions/subscription";

import { isPaywallExempt } from "./utils";

export type Props = {
   children: ReactNode;
};

export const AuthenticatedLayoutWrapper = async (props: Props) => {
   const { children } = props;

   const user = await requireUser();
   const cookieStore = await cookies();
   const headersList = await headers();

   const sidebarCookie = cookieStore.get("sidebar_state");
   const defaultOpen = !sidebarCookie || sidebarCookie.value === "true";

   const pathname = headersList.get("x-pathname") ?? "";

   if (!isPaywallExempt(pathname)) {
      const hasAccess = await getHasActiveAccess();
      if (!hasAccess) {
         return <TrialExpiredGate />;
      }
   }

   const trialStatus = await getTrialStatus();

   const trialBanner = () => {
      if (trialStatus?.isActive) {
         return <TrialBanner daysLeft={trialStatus.daysLeft} />;
      }
   };

   return (
      <div className="h-full" data-testid="authenticated-layout-wrapper">
         <SidebarProvider
            defaultOpen={defaultOpen}
            data-testid="sidebar-wrapper"
         >
            <Sidebar user={user} />
            <main className="flex-1">
               {trialBanner()}
               {children}
            </main>
         </SidebarProvider>
      </div>
   );
};
