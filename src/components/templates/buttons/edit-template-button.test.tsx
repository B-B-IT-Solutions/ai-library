import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { EditTemplateButton } from "./edit-template-button";

const assertRendered = () => {
   const editBtn = screen.getByTestId("edit-template-btn");
   assertInDocument(editBtn);
};

describe("EditTemplateButton rendering tests", () => {
   it("rendered test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();

      const { container } = renderWithRouter(
         <EditTemplateButton descriptor={descriptor} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditTemplateButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("edit btn clicked - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptorWithTemplate();
      renderWithRouter(<EditTemplateButton descriptor={descriptor} />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const editBtn = screen.getByTestId("edit-template-btn");
      await userEvent.click(editBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(
            `/templates/${descriptor.id}/edit`
         );
      });
   });
});
