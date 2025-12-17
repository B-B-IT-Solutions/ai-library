import {
   BookOpen,
   FileText,
   LayoutTemplate,
   Package,
   Send,
   Settings,
   ShoppingBag,
   Star,
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
      id: "/templates",
      title: "Templates",
      icon: LayoutTemplate,
      url: "/templates",
   },
   {
      id: "/favorites",
      title: "Favorites",
      icon: Star,
      url: "/favorites",
   },
   {
      id: "/marketplace",
      title: "Marketplace",
      icon: ShoppingBag,
      url: "/marketplace",
   },
   {
      id: "/library",
      title: "My Library",
      icon: BookOpen,
      url: "/library",
   },
   {
      id: "/orders",
      title: "Orders",
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
      title: "Invite People",
      icon: Users,
      url: "/invite-people",
   },
   {
      id: "/settings",
      title: "Settings",
      icon: Settings,
      url: "/settings",
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
