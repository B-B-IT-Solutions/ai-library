"use client";

import { map } from "es-toolkit/compat";
import { usePathname } from "next/navigation";

import {
   Sidebar as ShadcnSidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
} from "@/components/shadcn/sidebar";
import { LoginUser } from "@/data/types/next-auth";
import { SidebarHeader, SidebarMenuItem } from "../common";
import { DMenuItem } from "../types";

import { adminNavigationMenu1, adminNavigationMenu2 } from "./menus";

type Props = {
   user: LoginUser;
};

export const AdminSidebar = ({ user }: Props) => {
   const pathName = usePathname();

   const renderMenu = (menuItems: DMenuItem[]) => {
      return map(menuItems, (item) => {
         return <SidebarMenuItem menuItem={item} pathName={pathName} />;
      });
   };

   return (
      <ShadcnSidebar collapsible="icon" data-testid="admin-sidebar">
         <SidebarHeader />
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Administration</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>{renderMenu(adminNavigationMenu1)}</SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
               <SidebarGroupContent>
                  <SidebarMenu>{renderMenu(adminNavigationMenu2)}</SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
      </ShadcnSidebar>
   );
};
