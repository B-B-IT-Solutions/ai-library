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
   const privacyPolicyLink = screen.getByTestId("privacypolicy-link");
   const cookiesLink = screen.getByTestId("cookies-link");
   const impressumLink = screen.getByTestId("impressum-link");

   assertInDocument(footer);
   assertInDocument(appLink);
   assertInDocument(companyLinks);
   assertInDocument(legalLinks);
   assertInDocument(blogLink);
   assertInDocument(agbLink);
   assertInDocument(privacyPolicyLink);
   assertInDocument(cookiesLink);
   assertInDocument(impressumLink);

   assertHasAttributeWithValue(appLink, "href", "/");
   assertHasAttributeWithValue(
      blogLink,
      "href",
      "https://www.vision-notes.com/blog"
   );
   assertHasAttributeWithValue(
      impressumLink,
      "href",
      "https://www.vision-notes.com/legal/impressum"
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
