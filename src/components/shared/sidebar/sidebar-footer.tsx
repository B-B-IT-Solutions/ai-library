import { ChevronUp, User2 } from "lucide-react";

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

export const SidebarFooter = () => {
   return (
      <ShadcnSidebarFooter data-testid="sidebar-footer">
         <SidebarMenu data-testid="sidebar-footer-menu">
            <SidebarMenuItem>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild={true}>
                     <SidebarMenuButton>
                        <User2 /> Username
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
            </SidebarMenuItem>
         </SidebarMenu>
      </ShadcnSidebarFooter>
   );
};
