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
   it("collection undefined - test", async () => {
      const prompt = dtestData.dPrompt();

      const { container } = renderWithRouter(<EditButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("collection defined - test", async () => {
      const prompt = dtestData.dPrompt();
      const collection = dtestData.dCollection();

      const { container } = renderWithRouter(
         <EditButton prompt={prompt} collection={collection} />
      );

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

   it("edit btn clicked - collection undefined - test", async () => {
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

   it("edit btn clicked - collection defined - test", async () => {
      const prompt = dtestData.dPrompt();
      const collection = dtestData.dCollection();
      renderWithRouter(<EditButton prompt={prompt} collection={collection} />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const editBtn = screen.getByTestId("edit-prompt-btn");
      await userEvent.click(editBtn);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual(
            `/templates/${prompt.id}/edit?collectionId=${collection.id}`
         );
      });
   });
});
