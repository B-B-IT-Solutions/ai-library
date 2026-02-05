"use client";

import { FC } from "react";
import { ChevronUp, LogOut, User2 } from "lucide-react";

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import {
   SidebarFooter as ShadcnSidebarFooter,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
} from "@/components/shadcn/sidebar";
import { signOutUser } from "@/data/actions/user";
import { LoginUser } from "@/data/types/next-auth";

type SidebarFooterProps = {
   user: LoginUser;
};

export const SidebarFooter: FC<SidebarFooterProps> = ({ user }) => {
   const dropdownMenu = () => {
      const name = user.name ?? "Username";
      return (
         <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
               <SidebarMenuButton data-testid="sidebar-menu-btn">
                  <User2 /> {name}
                  <ChevronUp className="ml-auto" />
               </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
               side="top"
               sideOffset={20}
               align="start"
               className="w-(--radix-popper-anchor-width) border-indigo-300"
            >
               <DropdownMenuGroup>
                  <DropdownMenuItem
                     className="cursor-pointer rounded-lg px-2 py-1.5"
                     data-testid="account"
                  >
                     <span>Konto</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     className="cursor-pointer rounded-lg px-2 py-1.5"
                     data-testid="billing"
                  >
                     <span>Abrechnung</span>
                  </DropdownMenuItem>
               </DropdownMenuGroup>
               <DropdownMenuSeparator className="mx-2 my-1.5" />
               <DropdownMenuItem
                  className="cursor-pointer rounded-lg px-2 py-1.5"
                  onClick={signOutUser}
                  data-testid="sign-out"
               >
                  <LogOut />
                  <span>Abmelden</span>
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      );
   };

   return (
      <ShadcnSidebarFooter className="border-t" data-testid="sidebar-footer">
         <SidebarMenu data-testid="sidebar-footer-menu">
            <SidebarMenuItem>{dropdownMenu()}</SidebarMenuItem>
         </SidebarMenu>
      </ShadcnSidebarFooter>
   );
};
