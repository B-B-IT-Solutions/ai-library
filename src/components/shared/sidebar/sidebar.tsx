"use client";

import { FC } from "react";
import { map, startsWith } from "es-toolkit/compat";
import Image from "next/image";
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
   SidebarMenuBadge,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarTrigger,
   useSidebar,
} from "@/components/shadcn/sidebar";
import { LoginUser } from "@/data/types/next-auth";
import { APP_NAME } from "@/lib/constants";
import { toTestId } from "@/lib/utils";

import { navigationMenu1, navigationMenu2, navigationMenu3 } from "./menus";
import { SidebarFooter } from "./sidebar-footer";
import { DMenuItem } from "./types";

type SidebarProps = {
   user: LoginUser;
};

export const Sidebar: FC<SidebarProps> = ({ user }) => {
   const { open, openMobile } = useSidebar();

   const pathName = usePathname();

   const isActive = (path: string) => {
      return startsWith(pathName, path);
   };

   const renderMenu = (menuItems: DMenuItem[]) => {
      return map(menuItems, (m) => {
         return (
            <SidebarMenuItem key={m.id}>
               <SidebarMenuButton asChild={true} isActive={isActive(m.id)}>
                  <Link href={m.url} data-testid={`menu-item${toTestId(m.id)}`}>
                     <m.icon />
                     <span>{m.title}</span>
                  </Link>
               </SidebarMenuButton>
               {m.badge && (
                  <SidebarMenuBadge
                     className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary"
                     data-testid={`menu-item${toTestId(m.id)}-badge`}
                  >
                     {m.badge}
                  </SidebarMenuBadge>
               )}
            </SidebarMenuItem>
         );
      });
   };

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
      <ShadcnSidebar collapsible="icon" data-testid="sidebar">
         <SidebarHeader data-testid="sidebar-header">
            {appHeader()}
         </SidebarHeader>
         <SidebarContent data-testid="sidebar-content">
            <SidebarGroup data-testid="group-library">
               <SidebarGroupLabel>Bibliothek</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>{renderMenu(navigationMenu1)}</SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup data-testid="group-discover">
               <SidebarGroupLabel>Entdecken</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>{renderMenu(navigationMenu2)}</SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup data-testid="group-other">
               <SidebarGroupLabel>Mehr</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>{renderMenu(navigationMenu3)}</SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
         <SidebarFooter user={user} />
      </ShadcnSidebar>
   );
};
