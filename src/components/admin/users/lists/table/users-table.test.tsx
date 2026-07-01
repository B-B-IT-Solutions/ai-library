import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { adtestData, assertInDocument } from "@tests";

import { UsersTable } from "./users-table";

const assertRendered = () => {
   const table = screen.getByTestId("users-table");
   assertInDocument(table);
};

describe("AdminUsers rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("rendered test", async () => {
      const page = adtestData.dAdminUsersPage();
      const user1 = page.content[0];
      user1.role = "ADMIN";
      user1.subscriptionTier = undefined;
      user1.subscriptionStatus = undefined;
      user1.emailVerified = undefined;

      const { container } = render(<UsersTable users={page} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
