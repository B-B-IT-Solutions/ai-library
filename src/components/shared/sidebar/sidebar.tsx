"use client";

import { map, startsWith } from "es-toolkit/compat";
import { FileText, Settings, Star } from "lucide-react";
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

import { navigationMenu1 } from "./menus";
import { SidebarFooter } from "./sidebar-footer";

export const Sidebar = () => {
   const { open, openMobile } = useSidebar();

   const pathName = usePathname();

   const isActive = (path: string) => {
      return startsWith(pathName, path);
   };

   const sidebarMenu1 = () => {
      return map(navigationMenu1, (m) => {
         return (
            <SidebarMenuItem key={m.id}>
               <SidebarMenuButton asChild>
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
         <SidebarHeader> {appName()}</SidebarHeader>
         <SidebarContent>
            <SidebarGroup>
               <SidebarGroupLabel>Application</SidebarGroupLabel>
               <SidebarGroupContent>
                  <SidebarMenu>{sidebarMenu1()}</SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
            <div
               className="bg-white border-r border-slate-200 flex flex-col"
               data-testid="sidebar"
            >
               <div className="p-6 border-b border-slate-200">
                  <h1 className="text-2xl font-bold text-slate-900">
                     Prompt Manager
                  </h1>
               </div>

               <nav className="flex-1 p-4">
                  <Link
                     href="/prompts"
                     className={`flex items-center gap-3 rounded-lg transition-colors mb-2 ${
                        isActive("/prompts")
                           ? "bg-blue-50 text-blue-700 font-medium"
                           : "text-slate-600 hover:bg-slate-50"
                     }`}
                  >
                     <FileText className="w-5 h-5" />
                     Prompts
                  </Link>

                  <Link
                     href="/favorites"
                     className={`flex items-center gap-3 rounded-lg transition-colors mb-2 ${
                        isActive("/favorites")
                           ? "bg-blue-50 text-blue-700 font-medium"
                           : "text-slate-600 hover:bg-slate-50"
                     }`}
                  >
                     <Star className="w-5 h-5" />
                     Favorites
                  </Link>

                  <Link
                     href="/settings"
                     className={`flex items-center gap-3 rounded-lg transition-colors ${
                        isActive("/settings")
                           ? "bg-blue-50 text-blue-700 font-medium"
                           : "text-slate-600 hover:bg-slate-50"
                     }`}
                  >
                     <Settings className="w-5 h-5" />
                     Settings
                  </Link>
               </nav>
            </div>
         </SidebarContent>
         <SidebarFooter />
      </ShadcnSidebar>
   );
};
