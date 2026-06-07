import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { EditPromptButton } from "./edit-prompt-button";

const assertBtnRendered = () => {
   const editBtn = screen.getByTestId("edit-prompt-btn");
   assertInDocument(editBtn);
};

const assertMenuItemRendered = () => {
   const menuItem = screen.getByTestId("edit-prompt-menu-item");
   assertInDocument(menuItem);
};

describe("EditPromptButton rendering tests", () => {
   it("asMenuItem false - collection undefined - test", async () => {
      const prompt = dtestData.dPrompt();

      const { container } = renderWithRouter(
         <EditPromptButton prompt={prompt} />
      );

      await waitFor(() => {
         assertBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("asMenuItem true - collection defined - test", async () => {
      const prompt = dtestData.dPrompt();
      const collection = dtestData.dCollectionPreview();

      const { container } = renderWithRouter(
         <EditPromptButton prompt={prompt} currentCollection={collection} />
      );

      await waitFor(() => {
         assertBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("asMenuItem true - collection undefined - test", async () => {
      const prompt = dtestData.dPrompt();

      const { container } = renderWithRouter(
         <EditPromptButton prompt={prompt} asMenuItem={true} />
      );

      await waitFor(() => {
         assertMenuItemRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("asMenuItem true - collection defined - test", async () => {
      const prompt = dtestData.dPrompt();
      const collection = dtestData.dCollectionPreview();

      const { container } = renderWithRouter(
         <EditPromptButton
            prompt={prompt}
            currentCollection={collection}
            asMenuItem={true}
         />
      );

      await waitFor(() => {
         assertMenuItemRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("EditPromptButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("edit btn clicked - collection undefined - test", async () => {
      const prompt = dtestData.dPrompt();
      renderWithRouter(<EditPromptButton prompt={prompt} />);

      await waitFor(() => {
         assertBtnRendered();
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
      const collection = dtestData.dCollectionPreview();
      renderWithRouter(
         <EditPromptButton prompt={prompt} currentCollection={collection} />
      );

      await waitFor(() => {
         assertBtnRendered();
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
