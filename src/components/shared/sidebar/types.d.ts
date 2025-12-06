import { ReactNode } from "react";

export interface DMenuItem {
   id: string;
   title: string;
   url: string;
   icon?: ReactNode;
   external?: boolean;
   target?: "_self" | "_blank";
}
