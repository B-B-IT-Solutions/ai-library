jest.mock("@/data/actions/prompt");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
   renderWithRouter,
} from "@tests";
import mockRouter from "next-router-mock";

import { getPromptCategories, getPrompts } from "@/data/actions/prompt";
import { DPromptDescriptorsFilter } from "@/data/types/domain/prompt";

import { calculateFiltersCount, PromptsList } from "./prompts-list";

const getPromptCategoriesMock = getPromptCategories as jest.MockedFunction<
   typeof getPromptCategories
>;

const getPromptsMock = getPrompts as jest.MockedFunction<typeof getPrompts>;

const assertRendered = () => {
   const list = screen.getByTestId("prompts-list");
   const listHeader = screen.getByTestId("prompts-list-header");
   const filtersBtn = screen.getByTestId("filters-btn");
   const createPromptBtn = screen.getByTestId("create-prompt-btn");

   assertInDocument(list);
   assertInDocument(listHeader);
   assertInDocument(filtersBtn);
   assertInDocument(createPromptBtn);
};

const assertListItemsRendered = () => {
   const listItems = screen.getByTestId("prompts-list-items");
   const listItem = screen.getAllByTestId("prompt-list-item");

   assertInDocument(listItems);
   expect(listItem.length).toBeGreaterThan(0);
};

const assertListItemsEmptyRendered = () => {
   const itemsEmpty = screen.getByTestId("prompt-list-items-empty");
   const listItems = screen.queryByTestId("prompts-list-items");
   const listItem = screen.queryByTestId("prompt-list-item");

   assertInDocument(itemsEmpty);
   assertNotInDocument(listItems);
   assertNotInDocument(listItem);
};

const assertFiltersRendered = () => {
   const filters = screen.getByTestId("prompts-filter");
   assertInDocument(filters);
};

const assertFiltersNotRendered = () => {
   const filters = screen.queryByTestId("prompts-filter");
   assertNotInDocument(filters);
};

const assertFiltersCountRendered = () => {
   const count = screen.getByTestId("filters-count-badge");
   assertInDocument(count);
};

const assertFiltersCountNotRendered = () => {
   const count = screen.queryByTestId("filters-count-badge");
   assertNotInDocument(count);
};

describe("PromptsList rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("PromptsList - filters not displayed - rendered test", async () => {
      const page = dtestData.dPromptDescriptorsPage();
      getPromptsMock.mockResolvedValue(page);

      const { container } = renderWithReactQuery(<PromptsList />);

      await waitFor(() => {
         assertRendered();
         assertFiltersNotRendered();
         assertListItemsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("PromptsList - filters displayed - rendered test", async () => {
      const page = dtestData.dPromptDescriptorsPage();
      const categories = ["category 1", "category 2", "category 3"];
      getPromptsMock.mockResolvedValue(page);
      getPromptCategoriesMock.mockResolvedValue(categories);

      const { container } = renderWithReactQuery(<PromptsList />);

      await waitFor(() => {
         assertRendered();
         assertFiltersNotRendered();
         assertListItemsRendered();
      });

      const filtersBtn = screen.getByTestId("filters-btn");
      await userEvent.click(filtersBtn);

      await waitFor(() => {
         assertFiltersRendered();
      });

      // expect(container).toMatchSnapshot();
   });

   it("PromptsList - list items empty - rendered test", async () => {
      const page = dtestData.dPromptDescriptorsPage();
      page.content = [];
      page.numberOfElements = 0;
      page.totalElements = 0;
      getPromptsMock.mockResolvedValue(page);

      const { container } = renderWithReactQuery(<PromptsList />);

      await waitFor(() => {
         assertRendered();
         assertFiltersNotRendered();
         assertListItemsEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptsList functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("PromptsList - calculateFiltersCount - test", async () => {
      const filters1: DPromptDescriptorsFilter = {};
      const result1 = calculateFiltersCount(filters1);
      expect(result1).toEqual(0);

      const filters2: DPromptDescriptorsFilter = { search: "", categories: [] };
      const result2 = calculateFiltersCount(filters2);
      expect(result2).toEqual(0);

      const filters3: DPromptDescriptorsFilter = {
         search: "t",
         categories: [],
      };
      const result3 = calculateFiltersCount(filters3);
      expect(result3).toEqual(1);

      const filters4: DPromptDescriptorsFilter = {
         search: "t",
         categories: ["Category 1"],
      };
      const result4 = calculateFiltersCount(filters4);
      expect(result4).toEqual(2);
   });

   it("PromptsList - active filters - badge displayed when filters closed - test", async () => {
      const page = dtestData.dPromptDescriptorsPage();
      const categories = ["category 1", "category 2", "category 3"];
      getPromptsMock.mockResolvedValue(page);
      getPromptCategoriesMock.mockResolvedValue(categories);

      renderWithReactQuery(<PromptsList />);

      await waitFor(() => {
         assertRendered();
         assertFiltersNotRendered();
         expect(getPromptsMock).toHaveBeenCalledTimes(1);
      });

      const filtersBtn = screen.getByTestId("filters-btn");
      await userEvent.click(filtersBtn);

      await waitFor(() => {
         assertFiltersRendered();
      });

      const searchText = "test search 1";
      const input = screen.getByTestId("search-input");
      await userEvent.type(input, searchText);

      const options = { timeout: 1000 };
      await waitFor(() => {
         const text = screen.getByDisplayValue(searchText);
         assertInDocument(text);
         assertFiltersCountNotRendered();
      }, options);

      await userEvent.click(filtersBtn);
      await waitFor(() => {
         assertFiltersNotRendered();
         assertFiltersCountRendered();
      });
   });

   it("PromptsList - create prompt btn clicked - test", async () => {
      const page = dtestData.dPromptDescriptorsPage();
      getPromptsMock.mockResolvedValue(page);

      const url = "/prompts";
      renderWithRouter(<PromptsList />, url);

      await waitFor(() => {
         assertRendered();
         expect(getPromptsMock).toHaveBeenCalledTimes(1);
         expect(mockRouter.pathname).toEqual(url);
      });

      const createPromptBtn = screen.getByTestId("create-prompt-btn");
      await userEvent.click(createPromptBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/prompts/new");
      });
   });
});
