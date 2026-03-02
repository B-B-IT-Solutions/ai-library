import {
   BookOpen,
   FileText,
   Package,
   Send,
   Settings,
   ShoppingBag,
   Users,
} from "lucide-react";

import { navigationMenu1, navigationMenu2, navigationMenu3 } from "./menus";
import { DMenuItem } from "./types";

const expectedNavigationMenu1: DMenuItem[] = [
   {
      id: "/prompts",
      title: "Prompts",
      icon: FileText,
      url: "/prompts",
   },
   {
      id: "/library",
      title: "Vorlagen",
      icon: BookOpen,
      url: "/library",
   },
];

const expectedNavigationMenu2: DMenuItem[] = [
   {
      id: "/marketplace",
      title: "Bibliothek",
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

export const expectedNavigationMenu3: DMenuItem[] = [
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
      url: "/settings/general",
   },
];

describe("navigationMenus tests", () => {
   test("navigationMenu1 test", () => {
      expect(navigationMenu1).toEqual(expectedNavigationMenu1);
   });

   test("navigationMenu2 test", () => {
      expect(navigationMenu2).toEqual(expectedNavigationMenu2);
   });

   test("navigationMenu3 test", () => {
      expect(navigationMenu3).toEqual(expectedNavigationMenu3);
   });
});
