import { getByTestId, screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { CatalogEntryView } from "./catalog-entry-view";

const assertRendered = () => {
   const view = screen.getByTestId("catalog-entry-view");
   const header = screen.getByTestId("header");
   const cta = screen.getByTestId("cta");

   assertInDocument(view);
   assertInDocument(header);
   assertInDocument(cta);
};

const assertFieldsRendered = () => {
   const fields = screen.getByTestId("fields");
   const fieldItems = screen.getAllByTestId("field");

   assertInDocument(fields);
   expect(fieldItems.length).toBeGreaterThan(0);
};

const assertFieldsNotRendered = () => {
   const fields = screen.queryByTestId("fields");
   assertNotInDocument(fields);
};

const assertRelatedEntriesRendered = () => {
   const entries = screen.getByTestId("related-entries");
   const entryItems = screen.getAllByTestId("related-entry");

   assertInDocument(entries);
   expect(entryItems.length).toBeGreaterThan(0);
};

const assertRelatedEntriesNotRendered = () => {
   const entries = screen.queryByTestId("related-entries");
   assertNotInDocument(entries);
};

const assertAddToLibraryBtnRendered = () => {
   const header = screen.getByTestId("header");
   const cta = screen.getByTestId("cta");
   const headerCopyBtn = getByTestId(header, "add-entry-to-library-btn");
   const ctaCopyBtn = getByTestId(header, "add-entry-to-library-btn");

   assertInDocument(header);
   assertInDocument(cta);
   assertInDocument(headerCopyBtn);
   assertInDocument(ctaCopyBtn);
};

const assertUseBtnRendered = () => {
   const header = screen.getByTestId("header");
   const cta = screen.getByTestId("cta");
   const headerUseBtn = getByTestId(header, "use-entry-btn");
   const ctaUseBtn = getByTestId(header, "use-entry-btn");

   assertInDocument(header);
   assertInDocument(cta);
   assertInDocument(headerUseBtn);
   assertInDocument(ctaUseBtn);
};

describe("CatalogEntryView rendering tests", () => {
   it("relatedEntries empty - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);

      const { container } = render(
         <CatalogEntryView
            entry={entry}
            isAuthenticated={false}
            relatedEntries={[]}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         assertRelatedEntriesNotRendered();
         assertAddToLibraryBtnRendered();
         assertUseBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("relatedEntries defined - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);
      const relatedEntries = dtestData.dCatalogEntries();

      const { container } = render(
         <CatalogEntryView
            entry={entry}
            isAuthenticated={true}
            relatedEntries={relatedEntries}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         assertRelatedEntriesRendered();
         assertAddToLibraryBtnRendered();
         assertUseBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("fields empty - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);
      entry.fields = [];
      const relatedEntries = dtestData.dCatalogEntries();

      const { container } = render(
         <CatalogEntryView
            entry={entry}
            isAuthenticated={true}
            relatedEntries={relatedEntries}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertRelatedEntriesRendered();
         assertFieldsNotRendered();
         assertAddToLibraryBtnRendered();
         assertUseBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("field.options empty - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);
      entry.fields[0].options = [];
      const relatedEntries = dtestData.dCatalogEntries();

      const { container } = render(
         <CatalogEntryView
            entry={entry}
            isAuthenticated={true}
            relatedEntries={relatedEntries}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertFieldsRendered();
         assertRelatedEntriesRendered();
         assertAddToLibraryBtnRendered();
         assertUseBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
