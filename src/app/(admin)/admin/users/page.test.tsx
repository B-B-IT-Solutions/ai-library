jest.mock("@/components/admin/users", () => ({
   AdminUsers: () => {
      return <div data-testid="admin-users" />;
   },
}));

import { screen, waitFor } from "@testing-library/dom";
import { assertInDocument, renderAsyncRSC } from "@tests";
import { Metadata } from "next";

import { AdminUsersPage, metadata } from "./page";

const expectedMetadata: Metadata = {
   title: "Admin – Nutzer",
};

const assertRendered = () => {
   const page = screen.getByTestId("admin-users-page");
   const users = screen.getByTestId("admin-users");

   assertInDocument(page);
   assertInDocument(users);
};

describe("AdminUsersPage rendering tests", () => {
   it("page rendered - test", async () => {
      const { container } = await renderAsyncRSC(AdminUsersPage, {});

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
