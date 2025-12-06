import { Send, Settings, SquareChevronRight, Star, Users } from "lucide-react";

import { DMenuItem } from "./types";

export const navigationMenu1: DMenuItem[] = [
   {
      id: "prompts",
      title: "Prompts",
      icon: SquareChevronRight,
      url: "/prompts",
   },
   {
      id: "favorites",
      title: "Favorites",
      icon: Star,
      url: "/favorites",
   },
];

export const navigationMenu2: DMenuItem[] = [
   {
      id: "feedback",
      title: "Feedback",
      icon: Send,
      url: "/feedback",
   },
   {
      id: "invite-people",
      title: "Invite People",
      icon: Users,
      url: "/invite-people",
   },
   {
      id: "settings",
      title: "Settings",
      icon: Settings,
      url: "/settings",
   },
];
