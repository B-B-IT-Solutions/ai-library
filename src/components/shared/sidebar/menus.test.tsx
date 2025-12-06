import { Send, Settings, SquareChevronRight, Star, Users } from "lucide-react";

import { navigationMenu1, navigationMenu2 } from "./menus";
import { DMenuItem } from "./types";

const expectedNavigationMenu1: DMenuItem[] = [
   {
      id: "prompts",
      title: "Prompts",
      icon: <SquareChevronRight width={20} height={20} />,
      url: "/prompts",
   },
   {
      id: "favorites",
      title: "Favorites",
      icon: <Star width={20} height={20} />,
      url: "/favorites",
   },
];

export const expectedNavigationMenu2: DMenuItem[] = [
   {
      id: "feedback",
      title: "Feedback",
      icon: <Send width={20} height={20} />,
      url: "/feedback",
   },
   {
      id: "invite-people",
      title: "Invite People",
      icon: <Users width={20} height={20} />,
      url: "/invite-people",
   },
   {
      id: "settings",
      title: "Settings",
      icon: <Settings width={20} height={20} />,
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
