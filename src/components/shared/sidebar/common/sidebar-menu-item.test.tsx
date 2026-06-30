import { screen, waitFor } from "@testing-library/react";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   ctestData,
   renderWithSidebar,
} from "@tests";
import { LayoutDashboard, Users } from "lucide-react";

import { toTestId } from "@/lib/utils";
import { DMenuItem } from "../types";

import { SidebarMenuItem } from "./sidebar-menu-item";

const menuItem1: DMenuItem = {
   id: "/admin/dashboard",
   title: "Dashboard",
   icon: LayoutDashboard,
   url: "/admin/dashboard",
   badge: "badge 1",
};

const menuItem2: DMenuItem = {
   id: "/admin/users",
   title: "Nutzer",
   icon: Users,
   url: "/admin/users",
};

const assertRendered = () => {
   const item = screen.getByTestId("sidebar-menu-item");
   assertInDocument(item);
};

const assertActive = (item: DMenuItem, active: boolean) => {
   const link = screen.getByTestId(`menu-item${toTestId(item.id)}`);
   assertHasAttributeWithValue(link, "data-active", `${active}`);
};

describe("SidebarMenuItem rendering tests", () => {
   beforeEach(() => {
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("active true - test", async () => {
      const { container } = renderWithSidebar(
         <SidebarMenuItem menuItem={menuItem1} pathName={menuItem1.url} />
      );

      await waitFor(() => {
         assertRendered();
         assertActive(menuItem1, true);
      });

      expect(container).toMatchSnapshot();
   });

   it("active false - test", async () => {
      const { container } = renderWithSidebar(
         <SidebarMenuItem
            menuItem={menuItem2}
            pathName={"test/" + menuItem2.url}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertActive(menuItem2, false);
      });

      expect(container).toMatchSnapshot();
   });
});
