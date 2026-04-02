import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import { assertInDocument, dtestData } from "@tests";

import { LibraryEntryEdit } from "./library-entry-edit";

const assertRendered = () => {
   const editEntry = screen.getByTestId("library-entry-edit");
   const breadcrumbs = screen.getByTestId("libary-entry-breadcrumb");
   const form = screen.getByTestId("library-entry-edit-form");

   assertInDocument(editEntry);
   assertInDocument(breadcrumbs);
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
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      const fields = dtestData.dGlobalTemplateFields();

      const { container } = render(
         <LibraryEntryEdit descriptor={descriptor} globalFields={fields} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
