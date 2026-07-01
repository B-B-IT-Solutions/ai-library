import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { adtestData, assertInDocument } from "@tests";

import { AdminUserEdit } from "./user-edit";

const assertRendered = () => {
   const users = screen.getByTestId("admin-user-edit");
   const form = screen.getByTestId("user-role-form");

   assertInDocument(users);
   assertInDocument(form);
};

describe("AdminUserEdit rendering tests", () => {
   it("all values -  test", async () => {
      const user = adtestData.dAdminUser();

      const { container } = render(<AdminUserEdit user={user} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("values null - test", async () => {
      const user = adtestData.dAdminUser();
      user.role = "ADMIN";
      user.emailVerified = undefined;
      user.trialEndsAt = undefined;
      user.stripeCustomerId = null;

      const { container } = render(<AdminUserEdit user={user} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
