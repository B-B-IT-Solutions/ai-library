import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, ctestData, renderWithSidebar } from "@tests";
import mockRouter from "next-router-mock";

import { APP_NAME } from "@/lib/constants";

import { SidebarHeader } from "./sidebar-header";

const assertRendered = () => {
   const header = screen.getByTestId("sidebar-header");
   assertInDocument(header);
};

const assertLink = () => {
   const appName = screen.getByText(APP_NAME);
   const homeLink = screen.getByTestId("home-link");

   assertInDocument(homeLink);
   assertInDocument(appName);
};

describe("Sidebar rendering tests", () => {
   beforeEach(() => {
      window.matchMedia = ctestData.createMatchMedia(false);
   });

   it("open true - test", async () => {
      const url = "/admin";
      const { container } = renderWithSidebar(<SidebarHeader />, url, true);

      await waitFor(() => {
         assertRendered();
         assertLink();
      });

      expect(container).toMatchSnapshot();
   });

   it("open false - test", async () => {
      const url = "/admin";
      const { container } = renderWithSidebar(<SidebarHeader />, url, false);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("Sidebar functionality tests", () => {
   beforeEach(() => {
      window.matchMedia = ctestData.createMatchMedia(false);
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("home link clicked - test", async () => {
      const url = "/settings";
      renderWithSidebar(<SidebarHeader />, url);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      const homeLink = screen.getByTestId("home-link");
      await userEvent.click(homeLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/`);
      });
   });
});
