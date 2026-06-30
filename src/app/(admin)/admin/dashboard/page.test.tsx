jest.mock("@/components/admin/dashboard", () => ({
   AdminDashboard: () => {
      return <div data-testid="admin-dashboard" />;
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { AdminDashboardPage, metadata } from "./page";

const expectedMetadata: Metadata = {
   title: "Admin Dashboard",
};

const assertRendered = () => {
   const page = screen.getByTestId("admin-dashboard-page");
   const dashboard = screen.getByTestId("admin-dashboard");

   assertInDocument(page);
   assertInDocument(dashboard);
};

describe("AdminDashboardPage rendering tests", () => {
   it("page rendered - test", async () => {
      const { container } = await renderAsyncRSC(AdminDashboardPage, {});

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("AdminDashboardPage functionality tests", () => {
   it("metadata - test", async () => {
      expect(metadata).toEqual(expectedMetadata);
   });
});
