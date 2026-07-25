import { screen, waitFor } from "@testing-library/react";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { ModelItem } from "./model-item";

const assertRendered = () => {
   const item = screen.getByTestId("model-item");
   const updateBtn = screen.getByTestId("update-model-btn");
   const deleteBtn = screen.getByTestId("delete-model-btn");

   assertInDocument(item);
   assertInDocument(updateBtn);
   assertInDocument(deleteBtn);
};

describe("ModelItem rendering tests", () => {
   it("prompt count 1 - test", async () => {
      const model = dtestData.dPromptModelWithUsage();
      model.count = 1;

      const { container } = renderWithRouter(<ModelItem model={model} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("prompt count 10 - test", async () => {
      const model = dtestData.dPromptModelWithUsage(1);
      model.count = 10;

      renderWithRouter(<ModelItem model={model} />);

      await waitFor(() => {
         assertRendered();
      });
   });
});
