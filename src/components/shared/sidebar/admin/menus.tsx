import { ArrowLeft, BarChart3, LayoutDashboard, Users } from "lucide-react";

import { DMenuItem } from "../types";

export const adminNavigationMenu1: DMenuItem[] = [
   {
      id: "/admin/dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/admin/dashboard",
   },
   {
      id: "/admin/users",
      title: "Nutzer",
      icon: Users,
      url: "/admin/users",
   },
   {
      id: "/admin/subscription-plans",
      title: "Abo-Pläne",
      icon: BarChart3,
      url: "/admin/subscription-plans",
   },
];

export const adminNavigationMenu2: DMenuItem[] = [
   {
      id: "/",
      title: "Zurück zur Ap",
      icon: ArrowLeft,
      url: "/",
   },
];
