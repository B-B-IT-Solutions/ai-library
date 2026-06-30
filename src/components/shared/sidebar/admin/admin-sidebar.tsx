"use client";

import { startsWith } from "es-toolkit/compat";
import { BarChart3, CreditCard, LayoutDashboard, Users } from "lucide-react";
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
   SidebarTrigger,
   useSidebar,
} from "@/components/shadcn/sidebar";
import { LoginUser } from "@/data/types/next-auth";
import { APP_NAME } from "@/lib/constants";

const adminNavItems = [
   {
      id: "/admin",
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/admin",
      exact: true,
   },
   {
      id: "/admin/users",
      title: "Nutzer",
      icon: Users,
      url: "/admin/users",
      exact: false,
   },
   {
      id: "/admin/subscriptions",
      title: "Abonnements",
      icon: CreditCard,
      url: "/admin/subscriptions",
      exact: false,
   },
   {
      id: "/admin/subscription-plans",
      title: "Abo-Pläne",
      icon: BarChart3,
      url: "/admin/subscription-plans",
      exact: false,
   },
];

type Props = {
   user: LoginUser;
};

export const AdminSidebar = ({ user }: Props) => {
   const { open, openMobile } = useSidebar();
   const pathName = usePathname();

   const isActive = (item: (typeof adminNavItems)[0]) => {
      if (item.exact) return pathName === item.id;
      return startsWith(pathName, item.id);
   };

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
                     {adminNavItems.map((item) => (
                        <SidebarMenuItem key={item.id}>
                           <SidebarMenuButton asChild isActive={isActive(item)}>
                              <Link href={item.url}>
                                 <item.icon />
                                 <span>{item.title}</span>
                              </Link>
                           </SidebarMenuButton>
                        </SidebarMenuItem>
                     ))}
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
            <SidebarGroup>
               <SidebarGroupContent>
                  <SidebarMenu>
                     <SidebarMenuItem>
                        <SidebarMenuButton asChild>
                           <Link href="/">
                              <span>← Zurück zur App</span>
                           </Link>
                        </SidebarMenuButton>
                     </SidebarMenuItem>
                  </SidebarMenu>
               </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
      </ShadcnSidebar>
   );
};
