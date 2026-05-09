import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { DCatalogEntry } from "@/data/types/domain/catalog";

import { ExploreEntryCard } from "./catalog-entry-item";

const assertRendered = () => {
   const item = screen.getByTestId("catalog-entry-item");
   const header = screen.getByTestId("header");
   const content = screen.getByTestId("content");
   const footer = screen.getByTestId("footer");
   const titleLink = screen.getByTestId("entry-title-link");
   const useBtn = screen.getByTestId("use-entry-lazy-btn");
   const moreOptionsBtn = screen.getByTestId("catalog-entry-more-options-btn");

   assertInDocument(item);
   assertInDocument(header);
   assertInDocument(content);
   assertInDocument(footer);
   assertInDocument(titleLink);
   assertInDocument(useBtn);
   assertInDocument(moreOptionsBtn);
};

const assertViewLinkRendered = (entry: DCatalogEntry) => {
   const titleLink = screen.getByTestId("entry-title-link");

   assertInDocument(titleLink);
   expect(titleLink).toHaveAttribute("href", `/explore/${entry.slug}`);
};

const assertCopyCountRendered = () => {
   const count = screen.getByTestId("copy-count");
   assertInDocument(count);
};

const assertCopyCountNotRendered = () => {
   const count = screen.queryByTestId("copy-count");
   assertNotInDocument(count);
};

describe("ExploreEntryCard rendering tests", () => {
   it("copyCount 0 - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      entry.copyCount = 0;

      const { container } = render(<ExploreEntryCard entry={entry} />);

      await waitFor(() => {
         assertRendered();
         assertViewLinkRendered(entry);
         assertCopyCountNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("copyCount > 0 - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      entry.copyCount = 399;
      entry.category = null;
      entry.fields = [];

      const { container } = render(<ExploreEntryCard entry={entry} />);

      await waitFor(() => {
         assertRendered();
         assertViewLinkRendered(entry);
         assertCopyCountRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
