import { render, screen, waitFor } from "@testing-library/react";
import { assertHasAttributeWithValue, assertInDocument } from "@tests";

import { DesktopNav } from "./desktop-nav";

const assertRendered = () => {
   const desktopNav = screen.getByTestId("desktop-nav");
   const navigation = screen.getByTestId("navigation");
   const exploreLink = screen.getByTestId("explore-nav-item");
   const pricingLink = screen.getByTestId("pricing-nav-item");
   const blogLink = screen.getByTestId("blog-nav-item");

   assertInDocument(desktopNav);
   assertInDocument(navigation);
   assertInDocument(exploreLink);
   assertInDocument(pricingLink);
   assertInDocument(blogLink);

   assertHasAttributeWithValue(exploreLink, "href", "/explore");
   assertHasAttributeWithValue(
      pricingLink,
      "href",
      "https://www.vision-notes.com/pricing"
   );
   assertHasAttributeWithValue(
      blogLink,
      "href",
      "https://www.vision-notes.com/blog"
   );
};

const assertLoginBtnsRendered = () => {
   const signIn = screen.getByTestId("sign-in-link");
   const signUp = screen.getByTestId("sign-up-link");

   assertInDocument(signIn);
   assertInDocument(signUp);
};

describe("DesktopNav rendering tests", () => {
   it("authenticated true - test", async () => {
      const { container } = render(<DesktopNav authenticated={true} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("authenticated false - test", async () => {
      const { container } = render(<DesktopNav authenticated={false} />);

      await waitFor(() => {
         assertRendered();
         assertLoginBtnsRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
