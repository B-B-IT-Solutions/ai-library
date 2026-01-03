import {
   BookOpen,
   FileText,
   LayoutTemplate,
   Package,
   Send,
   Settings,
   ShoppingBag,
   Users,
} from "lucide-react";

import { DMenuItem } from "./types";

export const navigationMenu1: DMenuItem[] = [
   {
      id: "/prompts",
      title: "Prompts",
      icon: FileText,
      url: "/prompts",
   },
   {
      id: "/library",
      title: "Meine Bibliothek",
      icon: BookOpen,
      url: "/library",
   },
   {
      id: "/marketplace",
      title: "Marktplatz",
      icon: ShoppingBag,
      url: "/marketplace",
   },
   {
      id: "/orders",
      title: "Bestellungen",
      icon: Package,
      url: "/orders",
   },
];

export const navigationMenu2: DMenuItem[] = [
   {
      id: "/feedback",
      title: "Feedback",
      icon: Send,
      url: "/feedback",
   },
   {
      id: "/invite-people",
      title: "Personen einladen",
      icon: Users,
      url: "/invite-people",
   },
   {
      id: "/settings",
      title: "Einstellungen",
      icon: Settings,
      url: "/settings",
   },
];
