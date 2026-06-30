"use client";

import Link from "next/link";

import {
   SidebarHeader as ShadcnSidebarHeader,
   SidebarTrigger,
   useSidebar,
} from "@/components/shadcn/sidebar";
import { APP_NAME } from "@/lib/constants";

export const SidebarHeader = () => {
   const { open, openMobile } = useSidebar();

   const appHeader = () => {
      if (open || openMobile) {
         return (
            <div className="flex items-center justify-between gap-2 px-1 py-1">
               <Link
                  href="/"
                  className="flex min-w-0 items-center gap-2"
                  data-testid="home-link"
               >
                  <span className="truncate text-lg font-bold">{APP_NAME}</span>
               </Link>
               <SidebarTrigger
                  className="shrink-0 cursor-pointer"
                  data-testid="sidebar-trigger"
               />
            </div>
         );
      }

      return (
         <div className="flex items-center justify-center py-1">
            <SidebarTrigger
               className="shrink-0 cursor-pointer"
               data-testid="sidebar-trigger"
            />
         </div>
      );
   };

   return (
      <ShadcnSidebarHeader data-testid="sidebar-header">
         {appHeader()}
      </ShadcnSidebarHeader>
   );
};
