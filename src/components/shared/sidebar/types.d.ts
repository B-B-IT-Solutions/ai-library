import type { LucideIcon } from "lucide-react";

export interface DMenuItem {
   id: string;
   title: string;
   url: string;
   icon: LucideIcon;
   badge?: string;
   external?: boolean;
   target?: "_self" | "_blank";
}
