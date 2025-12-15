"use client";

import { map, startsWith } from "es-toolkit/compat";
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
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/shadcn/sidebar";

import { navigationMenu1, navigationMenu2 } from "./menus";
import { SidebarFooter } from "./sidebar-footer";

export const Sidebar = () => {
   const { open, openMobile } = useSidebar();

   const pathName = usePathname();

   const isActive = (path: string) => {
      return startsWith(pathName, path);
   };

   const renderMenu = (menuItems: typeof navigationMenu1) => {
      return map(menuItems, (m) => {
         return (
            <SidebarMenuItem key={m.id}>
               <SidebarMenuButton asChild={true} isActive={isActive(m.id)}>
                  <Link href={m.url}>
                     <m.icon />
                     <span>{m.title}</span>
                  </Link>
               </SidebarMenuButton>
            </SidebarMenuItem>
         );
      });
   };

   const appName = () => {
      if (open || openMobile) {
         return "Prompt Manager";
      }
      return "PM";
   };

   return (
      <ShadcnSidebar collapsible="icon">
         <SidebarHeader>{appName()}</SidebarHeader>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Application</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>{renderMenu(navigationMenu1)}</SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
               <SidebarGroupLabel>Other</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>{renderMenu(navigationMenu2)}</SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
         <SidebarFooter />
      </ShadcnSidebar>
   );
};
