import { render, screen, waitFor } from "@testing-library/react";
import { assertHasAttributeWithValue, assertInDocument } from "@tests";

import { Header } from "./header";

const assertRendered = () => {
   const header = screen.getByTestId("header");
   const appLink = screen.getByTestId("app-link");
   const desktopNav = screen.getByTestId("desktop-nav");
   const mobileNav = screen.getByTestId("mobile-nav");

   assertInDocument(header);
   assertInDocument(appLink);
   assertInDocument(desktopNav);
   assertInDocument(mobileNav);

   assertHasAttributeWithValue(appLink, "href", "/");
};

describe("Header rendering tests", () => {
   it("isAuthenticated false - test", async () => {
      const { container } = render(<Header authenticated={false} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("isAuthenticated true - test", async () => {
      const { container } = render(<Header authenticated={true} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
