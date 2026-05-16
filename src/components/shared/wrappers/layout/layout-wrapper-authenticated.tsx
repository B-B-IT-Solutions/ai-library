import { ReactNode } from "react";
import { cookies, headers } from "next/headers";

import { SidebarProvider } from "@/components/shadcn/sidebar";
import { Sidebar } from "@/components/shared";
import { TrialBanner } from "@/components/subscription/trial-banner";
import { TrialExpiredGate } from "@/components/subscription/trial-expired-gate";
import { requireUser } from "@/data/actions/auth-utils";
import {
   getHasActiveAccess,
   getTrialStatus,
} from "@/data/actions/subscription";

/**
 * Routes where the paywall gate is suppressed so users can select or pay for a
 * plan even after their trial has expired.
 */
const PAYWALL_EXEMPT_PATHS = ["/subscription/pricing", "/subscription/success", "/checkout"];

const isPaywallExempt = (pathname: string): boolean =>
   PAYWALL_EXEMPT_PATHS.some((exempt) => pathname.startsWith(exempt));

export type Props = {
   children: ReactNode;
};

export const AuthenticatedLayoutWrapper = async (props: Props) => {
   const { children } = props;

   const user = await requireUser();
   const cookieStore = await cookies();
   const headersList = await headers();

   const pathname = headersList.get("x-pathname") ?? "";
   const sidebarCookie = cookieStore.get("sidebar_state");
   const defaultOpen = !sidebarCookie || sidebarCookie.value === "true";

   // ── Paywall gate ───────────────────────────────────────────────────────────
   // Exempt subscription/checkout routes so users can complete payment even
   // after their trial has expired.
   if (!isPaywallExempt(pathname)) {
      const hasAccess = await getHasActiveAccess();
      if (!hasAccess) {
         return <TrialExpiredGate />;
      }
   }

   // ── Trial banner ───────────────────────────────────────────────────────────
   const trialStatus = await getTrialStatus();

   return (
      <div className="h-full" data-testid="authenticated-layout-wrapper">
         {trialStatus?.isActive && (
            <TrialBanner daysLeft={trialStatus.daysLeft} />
         )}
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
