import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { Library } from "./library";

const assertRendered = () => {
   const library = screen.getByTestId("library");
   const createEntryBtn = screen.getByTestId("create-library-entry-btn");

   assertInDocument(library);
   assertInDocument(createEntryBtn);
};

const assertLibraryEmpty = () => {
   const libraryEmpty = screen.getByTestId("library-empty");
   assertInDocument(libraryEmpty);
};

const assertLibraryEntriesRendered = () => {
   const entries = screen.getByTestId("library-entries");
   assertInDocument(entries);
};

describe("Library rendering tests", () => {
   it("Library - library empty - test", async () => {
      const { container } = render(<Library entries={[]} />);

      await waitFor(() => {
         assertRendered();
         assertLibraryEmpty();
      });

      expect(container).toMatchSnapshot();
   });

   it("Library - viewMode grid - rendered test", async () => {
      const entries = dtestData.dLibraryEntries();

      const { container } = render(<Library entries={entries} />);

      await waitFor(() => {
         assertRendered();
         assertLibraryEntriesRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("Library - viewMode list - rendered test", async () => {
      const entries = dtestData.dLibraryEntries();

      const { container } = render(<Library entries={entries} />);

      await waitFor(() => {
         assertRendered();
         assertLibraryEntriesRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
