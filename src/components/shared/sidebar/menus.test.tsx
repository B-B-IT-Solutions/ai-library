import {
   BookOpen,
   FileText,
   Package,
   Send,
   Settings,
   ShoppingBag,
   Users,
} from "lucide-react";

import { navigationMenu1, navigationMenu2 } from "./menus";
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

export const expectedNavigationMenu2: DMenuItem[] = [
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
});
