import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { GlobalTemplateFieldsList } from "./template-fields-list";

const assertRendered = () => {
   const list = screen.getByTestId("template-fields-list");
   const addBtn = screen.getByTestId("add-template-field-btn");
   const items = screen.getAllByTestId("template-field-item");

   assertInDocument(list);
   assertInDocument(addBtn);
   expect(items).toHaveLength(3);
};

describe("GlobalTemplateFieldsList rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("GlobalTemplateFieldsList render test", async () => {
      const fields = dtestData.dGlobalTemplateFields();

      const { container } = renderWithRouter(
         <GlobalTemplateFieldsList fields={fields} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});
