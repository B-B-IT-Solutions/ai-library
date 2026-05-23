import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { EditButton } from "./edit-prompt-button";

const assertRendered = () => {
   const editBtn = screen.getByTestId("edit-prompt-btn");
   assertInDocument(editBtn);
};

describe("EditButton rendering tests", () => {
   it("rendered test", async () => {
      const prompt = dtestData.dPrompt();

      const { container } = renderWithRouter(<EditButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("edit btn clicked - test", async () => {
      const prompt = dtestData.dPrompt();
      renderWithRouter(<EditButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const editBtn = screen.getByTestId("edit-prompt-btn");
      await userEvent.click(editBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/templates/${prompt.id}/edit`);
      });
   });
});
