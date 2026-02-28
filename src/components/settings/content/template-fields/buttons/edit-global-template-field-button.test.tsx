import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { EditGlobalTemplateFieldButton } from "./edit-global-template-field-button";

const assertRendered = () => {
   const editBtn = screen.getByTestId("edit-tempplate-field-btn");
   const dialog = screen.getByTestId("template-field-edit-dialog");

   assertInDocument(editBtn);
   assertInDocument(dialog);
};

describe("EditGlobalTemplateFieldButton rendering tests", () => {
   it("EditGlobalTemplateFieldButton rendered test", async () => {
      const field = dtestData.dGlobalTemplateField();

      const { container } = renderWithRouter(
         <EditGlobalTemplateFieldButton field={field} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditGlobalTemplateFieldButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("EditLibraryEntryButton - edit btn clicked - test", async () => {
      const field = dtestData.dGlobalTemplateField();

      renderWithRouter(<EditGlobalTemplateFieldButton field={field} />);

      await waitFor(() => {
         assertRendered();
      });

      const editBtn = screen.getByTestId("edit-tempplate-field-btn");
      await userEvent.click(editBtn);

      await waitFor(() => {
         assertRendered();
      });
   });
});
