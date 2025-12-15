import type { LucideIcon } from "lucide-react";

export interface DMenuItem {
   id: string;
   title: string;
   url: string;
   icon: LucideIcon;
   external?: boolean;
   target?: "_self" | "_blank";
}
