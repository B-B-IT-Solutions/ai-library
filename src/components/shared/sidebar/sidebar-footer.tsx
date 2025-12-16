"use client";

import { FC } from "react";
import { ChevronUp, LogOut, User2 } from "lucide-react";
import { User } from "next-auth";

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
                  sideOffset={20}
                  align="start"
                  className="w-(--radix-popper-anchor-width) border-indigo-300"
               >
                  <DropdownMenuGroup>
                     <DropdownMenuItem
                        className="px-2 py-1.5 cursor-pointer rounded-lg"
                        data-testid="account"
                     >
                        <span>Account</span>
                     </DropdownMenuItem>
                     <DropdownMenuItem
                        className="px-2 py-1.5 cursor-pointer rounded-lg"
                        data-testid="billing"
                     >
                        <span>Billing</span>
                     </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="mx-2 my-1.5" />
                  <DropdownMenuItem
                     className="px-2 py-1.5 cursor-pointer rounded-lg"
                     onClick={signOutUser}
                     data-testid="sign-out"
                  >
                     <LogOut />
                     <span>Sign out</span>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         );
      }
   };

   return (
      <ShadcnSidebarFooter className="border-t" data-testid="sidebar-footer">
         <SidebarMenu data-testid="sidebar-footer-menu">
            <SidebarMenuItem>{dropdownMenu()}</SidebarMenuItem>
         </SidebarMenu>
      </ShadcnSidebarFooter>
   );
};
