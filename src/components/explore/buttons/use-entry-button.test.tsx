import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument, dtestData } from "@tests";

import { UseEntryButton } from "./use-entry-button";

const assertRendered = () => {
   const btn = screen.getByTestId("use-entry-btn");
   assertInDocument(btn);
};

const assertDialogRendered = () => {
   const btn = screen.getByTestId("use-template-dialog");
   assertInDocument(btn);
};

const assertDialogNotRendered = () => {
   const btn = screen.queryByTestId("use-template-dialog");
   assertNotInDocument(btn);
};

describe("UseEntryButton rendering tests", () => {
   it("rendered - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);
      const { container } = render(<UseEntryButton entry={entry} />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("UseEntryButton functionality tests", () => {
   it("btn clicked - test", async () => {
      const entry = dtestData.dCatalogEntryWithContent(1);
      render(<UseEntryButton entry={entry} />);

      await waitFor(() => {
         assertRendered();
         assertDialogNotRendered();
      });

      const btn = screen.getByTestId("use-entry-btn");
      await userEvent.click(btn);

      await waitFor(() => {
         assertDialogRendered();
      });

      const closeBtn = screen.getByTestId("close-btn");
      await userEvent.click(closeBtn);

      await waitFor(() => {
         assertDialogNotRendered();
      });
   });
});
