import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { GeneralSettings } from "./general";

const assertRendered = () => {
   const settings = screen.getByTestId("general-settings");
   const profile = screen.getByTestId("user-profile");
   const password = screen.getByTestId("update-password");
   const theme = screen.getByTestId("theme");

   assertInDocument(settings);
   assertInDocument(profile);
   assertInDocument(password);
   assertInDocument(theme);
};

describe("GeneralSettings rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("GeneralSettings rendered test", async () => {
      const user = dtestData.dUser();
      const { container } = render(<GeneralSettings user={user} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
