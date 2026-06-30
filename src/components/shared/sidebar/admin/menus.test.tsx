import { ArrowLeft, BarChart3, LayoutDashboard, Users } from "lucide-react";

import { DMenuItem } from "../types";

import { adminNavigationMenu1, adminNavigationMenu2 } from "./menus";

const expectedAdminNavigationMenu1: DMenuItem[] = [
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

export const expectedAdminNavigationMenu2: DMenuItem[] = [
   {
      id: "/",
      title: "Zurück zur Ap",
      icon: ArrowLeft,
      url: "/",
   },
];

describe("adminNavigationMenus tests", () => {
   test("adminNavigationMenu1 test", () => {
      expect(adminNavigationMenu1).toEqual(expectedAdminNavigationMenu1);
   });

   test("navigationMenu1 test", () => {
      expect(adminNavigationMenu2).toEqual(expectedAdminNavigationMenu2);
   });
});
