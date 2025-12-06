import { Send, Settings, SquareChevronRight, Star, Users } from "lucide-react";

import { DMenuItem } from "./types";

export const navigationMenu1: DMenuItem[] = [
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

export const navigationMenu2: DMenuItem[] = [
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
