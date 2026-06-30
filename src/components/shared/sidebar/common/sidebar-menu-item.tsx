"use client";

import { startsWith } from "es-toolkit/compat";
import Link from "next/link";

import {
   SidebarMenuBadge,
   SidebarMenuButton,
   SidebarMenuItem as ShadcnSidebarMenuItem,
} from "@/components/shadcn/sidebar";
import { toTestId } from "@/lib/utils";
import { DMenuItem } from "../types";

type Props = {
   menuItem: DMenuItem;
   pathName: string;
};

export const SidebarMenuItem = ({ menuItem, pathName }: Props) => {
   const isActive = (path: string) => {
      return startsWith(pathName, path);
   };

   return (
      <ShadcnSidebarMenuItem data-testid="sidebar-menu-item">
         <SidebarMenuButton asChild={true} isActive={isActive(menuItem.id)}>
            <Link
               href={menuItem.url}
               data-testid={`menu-item${toTestId(menuItem.id)}`}
            >
               <menuItem.icon />
               <span>{menuItem.title}</span>
            </Link>
         </SidebarMenuButton>
         {menuItem.badge && (
            <SidebarMenuBadge
               className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary"
               data-testid={`menu-item${toTestId(menuItem.id)}-badge`}
            >
               {menuItem.badge}
            </SidebarMenuBadge>
         )}
      </ShadcnSidebarMenuItem>
   );
};
