import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { CatalogEntryMoreOptionsButton } from "./catalog-entry-more-options-button";

const assertRendered = () => {
   assertInDocument(screen.getByTestId("catalog-entry-more-options-btn"));
   assertInDocument(
      screen.getByTestId("catalog-entry-more-options-trigger-btn")
   );
};

const assertMenuRendered = () => {
   assertInDocument(screen.getByTestId("catalog-entry-more-options-view-item"));
};

const assertMenuNotRendered = () => {
   assertNotInDocument(
      screen.queryByTestId("catalog-entry-more-options-view-item")
   );
};

describe("CatalogEntryMoreOptionsButton rendering tests", () => {
   it("rendered - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      const { container } = render(
         <CatalogEntryMoreOptionsButton slug={entry.slug} />
      );

      await waitFor(() => {
         assertRendered();
         assertMenuNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CatalogEntryMoreOptionsButton functionality tests", () => {
   it("trigger clicked - menu opens - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      render(<CatalogEntryMoreOptionsButton slug={entry.slug} />);

      await waitFor(() => {
         assertRendered();
         assertMenuNotRendered();
      });

      const trigger = screen.getByTestId(
         "catalog-entry-more-options-trigger-btn"
      );
      await userEvent.click(trigger);

      await waitFor(() => {
         assertMenuRendered();
      });
   });

   it("Ansehen item has correct href - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      render(<CatalogEntryMoreOptionsButton slug={entry.slug} />);

      const trigger = screen.getByTestId(
         "catalog-entry-more-options-trigger-btn"
      );
      await userEvent.click(trigger);

      await waitFor(() => {
         const viewItem = screen.getByTestId(
            "catalog-entry-more-options-view-item"
         );
         expect(viewItem).toHaveAttribute("href", `/explore/${entry.slug}`);
      });
   });
});
