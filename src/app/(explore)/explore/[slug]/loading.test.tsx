import { render, screen, waitFor } from "@testing-library/react";
import { assertInDocument } from "@tests";

import { CatalogEntryPageLoading } from "./loading";

const assertRendered = () => {
   const loading = screen.getByTestId("catalog-entry-page-loading");
   assertInDocument(loading);
};

describe("CatalogEntryPageLoading rendering tests", () => {
   it("rendered - test", async () => {
      const { container } = render(<CatalogEntryPageLoading />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
