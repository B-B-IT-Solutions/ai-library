"use client";

import { map } from "es-toolkit/compat";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
   Sidebar as ShadcnSidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarTrigger,
   useSidebar,
} from "@/components/shadcn/sidebar";
import { LoginUser } from "@/data/types/next-auth";
import { APP_NAME } from "@/lib/constants";
import { SidebarMenuItem } from "../common";

import { adminNavigationMenu1, adminNavigationMenu2 } from "./menus";

type Props = {
   user: LoginUser;
};

export const AdminSidebar = ({ user }: Props) => {
   const { open, openMobile } = useSidebar();
   const pathName = usePathname();

   return (
      <ShadcnSidebar collapsible="icon" data-testid="admin-sidebar">
         <SidebarHeader data-testid="admin-sidebar-header">
            {open || openMobile ? (
               <div className="flex items-center justify-between gap-2 px-1 py-1">
                  <Link
                     href="/admin"
                     className="flex min-w-0 items-center gap-2"
                  >
                     <span className="truncate text-lg font-bold">
                        {APP_NAME} Admin
                     </span>
                  </Link>
                  <SidebarTrigger className="shrink-0 cursor-pointer" />
               </div>
            ) : (
               <div className="flex items-center justify-center py-1">
                  <SidebarTrigger className="shrink-0 cursor-pointer" />
               </div>
            )}
         </SidebarHeader>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Administration</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {map(adminNavigationMenu1, (item) => (
                        <SidebarMenuItem menuItem={item} pathName={pathName} />
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
               <SidebarGroupContent>
                  <SidebarMenu>
                     {map(adminNavigationMenu2, (item) => (
                        <SidebarMenuItem menuItem={item} pathName={pathName} />
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
      </ShadcnSidebar>
   );
};
