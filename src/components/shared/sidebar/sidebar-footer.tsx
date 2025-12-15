"use client";

import { FC } from "react";
import { ChevronUp, User2 } from "lucide-react";
import { User } from "next-auth";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
   SidebarFooter as ShadcnSidebarFooter,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/shadcn/sidebar";

type SidebarFooterProps = {
   user?: User;
};

export const SidebarFooter: FC<SidebarFooterProps> = ({ user }) => {
   const dropdownMenu = () => {
      if (user) {
         const name = user.name ?? "Username";

         return (
            <DropdownMenu>
               <DropdownMenuTrigger asChild={true}>
                  <SidebarMenuButton>
                     <User2 /> {name}
                     <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
               </DropdownMenuTrigger>
               <DropdownMenuContent
                  side="top"
                  className="w-(--radix-popper-anchor-width)"
               >
                  <DropdownMenuItem data-testid="account">
                     <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="billing">
                     <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="sign-out">
                     <span>Sign out</span>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         );
      }
   };

   return (
      <ShadcnSidebarFooter data-testid="sidebar-footer">
         <SidebarMenu data-testid="sidebar-footer-menu">
            <SidebarMenuItem>{dropdownMenu()}</SidebarMenuItem>
         </SidebarMenu>
      </ShadcnSidebarFooter>
   );
};
