import {
   Braces,
   FileText,
   Package,
   Send,
   Settings,
   ShoppingBag,
   Users,
} from "lucide-react";

import { DMenuItem } from "./types";

export const navigationMenu1: DMenuItem[] = [
   {
      id: "/templates",
      title: "Vorlagen",
      icon: Braces,
      url: "/templates",
   },
   {
      id: "/prompts",
      title: "Prompts",
      icon: FileText,
      url: "/prompts",
   },
];

export const navigationMenu2: DMenuItem[] = [
   {
      id: "/marketplace",
      title: "Bibliothek",
      icon: ShoppingBag,
      url: "/marketplace",
   },
   // {
   //    id: "/orders",
   //    title: "Bestellungen",
   //    icon: Package,
   //    url: "/orders",
   // },
];

export const navigationMenu3: DMenuItem[] = [
   // {
   //    id: "/feedback",
   //    title: "Feedback",
   //    icon: Send,
   //    url: "/feedback",
   // },
   // {
   //    id: "/invite-people",
   //    title: "Personen einladen",
   //    icon: Users,
   //    url: "/invite-people",
   // },
   {
      id: "/settings",
      title: "Einstellungen",
      icon: Settings,
      url: "/settings/general",
   },
];
