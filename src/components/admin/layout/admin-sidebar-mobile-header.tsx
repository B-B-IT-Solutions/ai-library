"use client";

import { SidebarTrigger } from "@/components/shadcn/sidebar";
import { APP_NAME } from "@/lib/constants";

export const AdminSidebarMobileHeader = () => {
   return (
      <header className="flex items-center gap-3 border-b bg-white px-4 py-3 sm:hidden">
         <SidebarTrigger
            className="cursor-pointer"
            data-testid="admin-sidebar-mobile-header"
         />
         <span className="text-base font-bold">{APP_NAME} Admin</span>
      </header>
   );
};
