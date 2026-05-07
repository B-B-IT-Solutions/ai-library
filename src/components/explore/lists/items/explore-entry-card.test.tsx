import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData } from "@tests";

import { ExploreEntryCard } from "./explore-entry-card";

describe("ExploreEntryCard rendering tests", () => {
   it("ExploreEntryCard - renders title - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      const { container } = render(<ExploreEntryCard entry={entry} />);

      await waitFor(() => {
         const title = screen.getByTestId("explore-entry-card-title");
         assertInDocument(title);
         expect(title).toHaveTextContent(entry.title);
      });

      expect(container).toMatchSnapshot();
   });

   it("ExploreEntryCard - renders category badge - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      render(<ExploreEntryCard entry={entry} />);

      await waitFor(() => {
         const category = screen.getByTestId("explore-entry-card-category");
         assertInDocument(category);
         expect(category).toHaveTextContent(entry.category!.name);
      });
   });

   it("ExploreEntryCard - no category - category badge not rendered - test", async () => {
      const entry = {
         ...dtestData.dCatalogEntry(1),
         category: null,
      };
      render(<ExploreEntryCard entry={entry} />);

      await waitFor(() => {
         expect(
            screen.queryByTestId("explore-entry-card-category")
         ).not.toBeInTheDocument();
      });
   });

   it("ExploreEntryCard - renders field count - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      render(<ExploreEntryCard entry={entry} />);

      await waitFor(() => {
         const fieldCount = screen.getByTestId(
            "explore-entry-card-field-count"
         );
         assertInDocument(fieldCount);
         expect(fieldCount).toHaveTextContent(`${entry.fields.length}`);
      });
   });

   it("ExploreEntryCard - renders recommended model - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      render(<ExploreEntryCard entry={entry} />);

      await waitFor(() => {
         const card = screen.getByTestId("explore-entry-card");
         assertInDocument(card);
         expect(card).toHaveTextContent(entry.recommendedModel);
      });
   });

   it("ExploreEntryCard - title is a link to detail page - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      render(<ExploreEntryCard entry={entry} />);

      await waitFor(() => {
         const title = screen.getByTestId("explore-entry-card-title");
         assertInDocument(title);
         expect(title).toHaveAttribute("href", `/explore/${entry.slug}`);
      });
   });

   it("ExploreEntryCard - copyCount > 0 - shows copy count - test", async () => {
      const entry = { ...dtestData.dCatalogEntry(1), copyCount: 42 };
      render(<ExploreEntryCard entry={entry} />);

      await waitFor(() => {
         const card = screen.getByTestId("explore-entry-card");
         expect(card).toHaveTextContent("42× übernommen");
      });
   });

   it("ExploreEntryCard - copyCount 0 - does not show copy count - test", async () => {
      const entry = { ...dtestData.dCatalogEntry(1), copyCount: 0 };
      render(<ExploreEntryCard entry={entry} />);

      await waitFor(() => {
         const card = screen.getByTestId("explore-entry-card");
         expect(card).not.toHaveTextContent("× übernommen");
      });
   });

   it("ExploreEntryCard - single field - renders singular Feld label - test", async () => {
      const entry = {
         ...dtestData.dCatalogEntry(1),
         fields: [dtestData.dCatalogEntryField(1)],
      };
      render(<ExploreEntryCard entry={entry} />);

      await waitFor(() => {
         const fieldCount = screen.getByTestId(
            "explore-entry-card-field-count"
         );
         expect(fieldCount).toHaveTextContent("1 Feld");
      });
   });

   it("ExploreEntryCard - multiple fields - renders plural Felder label - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      // dCatalogEntrySummary uses 3 fields by default
      render(<ExploreEntryCard entry={entry} />);

      await waitFor(() => {
         const fieldCount = screen.getByTestId(
            "explore-entry-card-field-count"
         );
         expect(fieldCount).toHaveTextContent("3 Felder");
      });
   });

   it("ExploreEntryCard - renders use lazy button - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      render(<ExploreEntryCard entry={entry} />);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("catalog-entry-use-lazy-btn"));
      });
   });

   it("ExploreEntryCard - renders context menu trigger - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      render(<ExploreEntryCard entry={entry} />);

      await waitFor(() => {
         assertInDocument(
            screen.getByTestId("explore-entry-card-menu-trigger")
         );
      });
   });

   it("ExploreEntryCard - context menu opens and shows Ansehen link - test", async () => {
      const entry = dtestData.dCatalogEntry(1);
      render(<ExploreEntryCard entry={entry} />);

      const trigger = screen.getByTestId("explore-entry-card-menu-trigger");
      await userEvent.click(trigger);

      await waitFor(() => {
         const viewLink = screen.getByTestId("explore-entry-card-view-link");
         assertInDocument(viewLink);
         expect(viewLink).toHaveAttribute("href", `/explore/${entry.slug}`);
      });
   });
});
