"use client";

import { FC } from "react";
import { map, startsWith } from "es-toolkit/compat";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "next-auth";

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
import { APP_NAME } from "@/lib/constants";
import { toTestId } from "@/lib/utils";

import { navigationMenu1, navigationMenu2 } from "./menus";
import { SidebarFooter } from "./sidebar-footer";

type SidebarProps = {
   user?: User;
};

export const Sidebar: FC<SidebarProps> = ({ user }) => {
   const { open, openMobile } = useSidebar();

   const pathName = usePathname();

   const isActive = (path: string) => {
      return startsWith(pathName, path);
   };

   const renderMenu = (menuItems: typeof navigationMenu1) => {
      return map(menuItems, (m) => {
         return (
            <SidebarMenuItem
               key={m.id}
               data-testid={`menu-item${toTestId(m.id)}`}
            >
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

   const appHeader = () => {
      return (
         <>
            <Link href="/" className="flex items-center gap-2 px-2 py-1">
               <Image
                  src="/images/logo.svg"
                  width={32}
                  height={32}
                  alt={`${APP_NAME} logo`}
                  className="shrink-0"
               />
               {(open || openMobile) && (
                  <span className="font-bold text-lg truncate">{APP_NAME}</span>
               )}
            </Link>
         </>
      );
   };

   return (
      <ShadcnSidebar collapsible="icon" data-testid="sidebar">
         <SidebarHeader data-testid="sidebar-header">
            {appHeader()}
         </SidebarHeader>
         <SidebarContent data-testid="sidebar-content">
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
         <SidebarFooter user={user} />
      </ShadcnSidebar>
   );
};
