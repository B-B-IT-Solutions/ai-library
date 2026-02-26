import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { AccountSettings } from "./account-settings";

const assertRendered = () => {
   const settings = screen.getByTestId("account-settings");
   const deleteAccount = screen.getByTestId("delete-account");

   assertInDocument(settings);
   assertInDocument(deleteAccount);
};

describe("AccountSettings rendering tests", () => {
   it("AccountSettings rendered test", async () => {
      const { container } = render(<AccountSettings />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
