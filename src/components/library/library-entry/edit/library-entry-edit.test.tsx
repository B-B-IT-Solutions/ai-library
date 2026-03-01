import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { LibraryEntryEdit } from "./library-entry-edit";

const assertRendered = () => {
   const editEntry = screen.getByTestId("library-entry-edit");
   const returnBtn = screen.getByTestId("return-to-library-btn");
   const form = screen.getByTestId("library-entry-edit-form");

   assertInDocument(editEntry);
   assertInDocument(returnBtn);
   assertInDocument(form);
};

describe("LibraryEntryEdit rendering tests", () => {
   it("LibraryEntryEdit - new entry - test", async () => {
      const { container } = render(<LibraryEntryEdit globalFields={[]} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryEntryEdit - edit existing entry - test", async () => {
      const entry = dtestData.dLibraryEntryWithPromptTemplate();
      const fields = dtestData.dGlobalTemplateFields();

      const { container } = render(
         <LibraryEntryEdit entry={entry} globalFields={fields} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
