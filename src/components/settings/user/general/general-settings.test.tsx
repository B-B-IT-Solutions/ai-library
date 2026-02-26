import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { GeneralSettings } from "./general-settings";

const assertRendered = () => {
   const settings = screen.getByTestId("general-settings");
   const profile = screen.getByTestId("user-profile");
   const password = screen.getByTestId("update-password");

   assertInDocument(settings);
   assertInDocument(profile);
   assertInDocument(password);
};

describe("GeneralSettings rendering tests", () => {
   it("GeneralSettings rendered test", async () => {
      const user = dtestData.dUser();
      const { container } = render(<GeneralSettings user={user} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
