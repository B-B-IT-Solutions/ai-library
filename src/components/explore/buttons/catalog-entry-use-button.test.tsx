import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { CatalogEntryUseButton } from "./catalog-entry-use-button";

describe("CatalogEntryUseButton rendering tests", () => {
   it("Button wird gerendert - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);
      const { container } = render(<CatalogEntryUseButton entry={entry} />);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("catalog-entry-use-btn"));
      });

      expect(container).toMatchSnapshot();
   });

   it("Dialog nicht sichtbar beim Laden - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);
      render(<CatalogEntryUseButton entry={entry} />);

      await waitFor(() => {
         assertNotInDocument(screen.queryByTestId("use-template-dialog"));
      });
   });
});

describe("CatalogEntryUseButton functionality tests", () => {
   it("Klick öffnet Dialog - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);
      render(<CatalogEntryUseButton entry={entry} />);

      const btn = screen.getByTestId("catalog-entry-use-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("use-template-dialog"));
      });
   });

   it("Dialog schließt bei onCancel - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);
      render(<CatalogEntryUseButton entry={entry} />);

      const btn = screen.getByTestId("catalog-entry-use-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("use-template-dialog"));
      });

      const closeBtn = screen.getByTestId("close-btn");
      await userEvent.click(closeBtn);

      await waitFor(() => {
         assertNotInDocument(screen.queryByTestId("use-template-dialog"));
      });
   });
});
