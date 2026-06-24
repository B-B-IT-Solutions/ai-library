import { render, screen, waitFor } from "@testing-library/react";
import { assertHasAttributeWithValue, assertInDocument } from "@tests";

import { Footer } from "./footer";

const assertRendered = () => {
   const footer = screen.getByTestId("footer");
   const appLink = screen.getByTestId("app-link");
   const companyLinks = screen.getByTestId("company-links");
   const legalLinks = screen.getByTestId("legal-links");
   const blogLink = screen.getByTestId("blog-link");
   const agbLink = screen.getByTestId("agb-link");
   const ppLink = screen.getByTestId("privacypolicy-link");
   const cookiesLink = screen.getByTestId("cookies-link");
   const impressumLink = screen.getByTestId("impressum-link");

   assertInDocument(footer);
   assertInDocument(appLink);
   assertInDocument(companyLinks);
   assertInDocument(legalLinks);
   assertInDocument(blogLink);
   assertInDocument(agbLink);
   assertInDocument(ppLink);
   assertInDocument(cookiesLink);
   assertInDocument(impressumLink);

   assertHasAttributeWithValue(appLink, "href", "/");
   assertHasAttributeWithValue(
      blogLink,
      "href",
      "https://www.vision-notes.com/blog"
   );
   assertHasAttributeWithValue(
      agbLink,
      "href",
      "https://www.iubenda.com/terms-and-conditions/97062585"
   );
   assertHasAttributeWithValue(
      ppLink,
      "href",
      "https://www.iubenda.com/privacy-policy/97062585/full-legal"
   );
   assertHasAttributeWithValue(
      cookiesLink,
      "href",
      "https://www.iubenda.com/privacy-policy/97062585/cookie-policy"
   );
   assertHasAttributeWithValue(
      impressumLink,
      "href",
      "https://www.vision-notes.com/legal/impressum"
   );
   assertHasAttributeWithValue(agbLink, "rel", "noopener noreferrer nofollow");
   assertHasAttributeWithValue(ppLink, "rel", "noopener noreferrer nofollow");
   assertHasAttributeWithValue(
      cookiesLink,
      "rel",
      "noopener noreferrer nofollow"
   );
   assertHasAttributeWithValue(
      impressumLink,
      "rel",
      "noopener noreferrer nofollow"
   );
};

describe("Footer rendering tests", () => {
   it("rendered - test", async () => {
      const { container } = render(<Footer />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
