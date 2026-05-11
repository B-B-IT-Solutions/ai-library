import { createRef } from "react";
import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { DCatalogEntry } from "@/data/types/domain/catalog";

import { CatalogEntryItem } from "./catalog-entry-item";

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

const assertFieldsCountRendered = () => {
   const count = screen.getByTestId("fields-count");
   assertInDocument(count);
};

const assertFieldsCountNotRendered = () => {
   const count = screen.queryByTestId("fields-count");
   assertNotInDocument(count);
};

const assertCopyCountRendered = () => {
   const count = screen.getByTestId("copy-count");
   assertInDocument(count);
};

const assertCopyCountNotRendered = () => {
   const count = screen.queryByTestId("copy-count");
   assertNotInDocument(count);
};

describe("CatalogEntryItem rendering tests", () => {
   it("copy count > 0 - fields count 3 - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      entry.copyCount = 399;

      const { container } = render(
         <CatalogEntryItem entry={entry} isAuthenticated={true} />
      );

      await waitFor(() => {
         assertRendered();
         assertViewLinkRendered(entry);
         assertFieldsCountRendered();
         assertCopyCountRendered();
      });

      expect(container).toMatchSnapshot();
   });
   it("copy count > 0 - fields count 1 - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      entry.copyCount = 499;
      entry.fields = dtestData.dCatalogEntryFields(1);

      const { container } = render(
         <CatalogEntryItem entry={entry} isAuthenticated={false} />
      );

      await waitFor(() => {
         assertRendered();
         assertViewLinkRendered(entry);
         assertFieldsCountRendered();
         assertCopyCountRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("copy count 0 - fields count 0 - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      entry.copyCount = 0;
      entry.category = null;
      entry.fields = [];

      const { container } = render(
         <CatalogEntryItem entry={entry} isAuthenticated={true} />
      );

      await waitFor(() => {
         assertRendered();
         assertViewLinkRendered(entry);
         assertFieldsCountNotRendered();
         assertCopyCountNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplateItemCard ref tests", () => {
   it("ref is forwarded to the Item DOM element - test", async () => {
      const ref = createRef<HTMLDivElement>();
      const entry = dtestData.dCatalogEntry(1);

      render(
         <CatalogEntryItem entry={entry} isAuthenticated={false} ref={ref} />
      );

      await waitFor(() => {
         const item = screen.getByTestId("catalog-entry-item");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(item);
      });
   });
});
