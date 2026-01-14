jest.mock("sonner");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithRouter,
} from "@tests";
import mockRouter from "next-router-mock";

import { PromptListItem } from "./prompt-list-item";

const assertRendered = () => {
   const listItem = screen.getByTestId("prompt-list-item");
   const isFavorite = screen.getByTestId("is-favorite");

   assertInDocument(listItem);
   assertInDocument(isFavorite);
};

const assertCategoriesRendered = () => {
   const categories = screen.getByTestId("categories");
   assertInDocument(categories);
};

const assertCategoriesNotRendered = () => {
   const categories = screen.queryByTestId("categories");
   assertNotInDocument(categories);
};

describe("PromptListItem rendering tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("PromptListItem - isSelected false - rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      prompt.categories = [];
      prompt.isFavorite = false;

      const url = `/prompts/random-prompt-id-123`;
      const { container } = renderWithRouter(
         <PromptListItem prompt={prompt} />,
         url
      );

      await waitFor(() => {
         assertRendered();
         assertCategoriesNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptListItem - isSelected true - rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();

      const url = `/prompts/${prompt.id}`;
      const { container } = renderWithRouter(
         <PromptListItem prompt={prompt} />,
         url
      );
      await waitFor(() => {
         assertRendered();
         assertCategoriesRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptListItem - categories 1 - rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      const categories = dtestData.dPromptCategories(1);
      prompt.categories = categories;

      const url = `/prompts/${prompt.id}`;
      const { container } = renderWithRouter(
         <PromptListItem prompt={prompt} />,
         url
      );
      await waitFor(() => {
         assertRendered();
         assertCategoriesRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptListItem - categories 2 - rendered test", async () => {
      const prompt = dtestData.dPromptDescriptor();
      const categories = dtestData.dPromptCategories(3);
      prompt.categories = categories;

      const url = `/prompts/${prompt.id}`;
      const { container } = renderWithRouter(
         <PromptListItem prompt={prompt} />,
         url
      );
      await waitFor(() => {
         assertRendered();
         assertCategoriesRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptListItem functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("PromptListItem - item clicked - test", async () => {
      const prompt = dtestData.dPromptDescriptor();

      const url = "/prompts";
      renderWithRouter(<PromptListItem prompt={prompt} />, url);

      await waitFor(() => {
         assertRendered();
         expect(mockRouter.pathname).toEqual(url);
      });

      const listItem = screen.getByTestId("prompt-list-item");
      await userEvent.click(listItem);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/prompts/${prompt.id}`);
      });
   });
});
