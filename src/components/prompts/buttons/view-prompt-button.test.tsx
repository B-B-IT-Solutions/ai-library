import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";
import mockRouter from "next-router-mock";

import { ViewPromptButton } from "./view-prompt-button";

const assertRendered = () => {
   const menuItem = screen.getByTestId("view-prompt-menu-item");
   assertInDocument(menuItem);
};

describe("ViewPromptButton rendering tests", () => {
   it("collection undefined - test", async () => {
      const prompt = dtestData.dPrompt();

      const { container } = renderWithRouter(
         <ViewPromptButton prompt={prompt} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("collection defined - test", async () => {
      const prompt = dtestData.dPrompt();
      const collection = dtestData.dCollectionPreview();

      const { container } = renderWithRouter(
         <ViewPromptButton prompt={prompt} currentCollection={collection} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("ViewPromptButton functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("view btn clicked - collection undefined - test", async () => {
      const prompt = dtestData.dPrompt();
      render(<ViewPromptButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const viewBtn = screen.getByTestId("view-prompt-menu-item");
      await userEvent.click(viewBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/templates/${prompt.id}`);
      });
   });

   it("view btn clicked - collection defined - test", async () => {
      const prompt = dtestData.dPrompt();
      const collection = dtestData.dCollectionPreview();
      render(
         <ViewPromptButton prompt={prompt} currentCollection={collection} />
      );

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual("/");
         expect(mockRouter.query).toEqual({});
      });

      const viewBtn = screen.getByTestId("view-prompt-menu-item");
      await userEvent.click(viewBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/templates/${prompt.id}`);
         expect(mockRouter.query).toEqual({ collectionId: collection.id });
      });
   });
});
