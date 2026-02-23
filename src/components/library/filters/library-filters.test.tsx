jest.mock("@/data/actions/library");

jest.mock("use-debounce", () => ({
   useDebouncedCallback: <T extends (...args: unknown[]) => unknown>(
      callback: T
   ) => {
      return (...args: Parameters<T>) => callback(...args);
   },
}));

import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { getLibraryModels } from "@/data/actions/library";

import { LibraryFilters } from "./library-filters";

const getLibraryModelsMock = getLibraryModels as jest.MockedFunction<
   typeof getLibraryModels
>;

const assertRendered = () => {
   const filters = screen.getByTestId("library-entry-filters-trigger");
   const search = screen.getByTestId("search-filter");
   const categories = screen.getByTestId("categories-filter");
   const models = screen.getByTestId("models-filter");
   const applyBtn = screen.getByTestId("apply-filters-btn");

   assertInDocument(filters);
   assertInDocument(search);
   assertInDocument(categories);
   assertInDocument(models);
   assertInDocument(applyBtn);
};

const assertCategoriesEmptyRendered = () => {
   const empty = screen.getByTestId("categories-empty");
   assertInDocument(empty);
};

describe("LibraryFilters rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("LibraryFilters - filters empty - test", async () => {
      getLibraryModelsMock.mockResolvedValue([]);

      const url = "/library";
      const searchParams = "";
      const { container } = renderWithRouter(
         <LibraryFilters categories={[]} />,
         url,
         searchParams
      );

      await waitFor(() => {
         assertCategoriesEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryFilters - filters defined - test", async () => {
      const categories = dtestData.dLibraryEntryCategories();
      const models = ["mod-1", "mod-2", "mod-3"];

      getLibraryModelsMock.mockResolvedValue(models);

      const url = "/library";
      const searchParams = "f_search=test-1";
      const { container } = renderWithRouter(
         <LibraryFilters categories={categories} />,
         url,
         searchParams
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("LibraryFilters functinality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("LibraryFilters - search filter input - test", async () => {
      const categories = dtestData.dLibraryEntryCategories();
      const models = ["mod-1", "mod-2", "mod-3"];

      getLibraryModelsMock.mockResolvedValue(models);

      const url = "/library";
      const searchParams = "";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <LibraryFilters categories={categories} />,
         url,
         searchParams,
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const triggerBtn = screen.getByTestId("library-entry-filters-trigger");
      await userEvent.click(triggerBtn);

      const searchFilter = screen.getByTestId("search-filter");
      const input = within(searchFilter).getByTestId("input");

      const value = "test-123";
      await userEvent.type(input, value);

      await waitFor(() => {
         const inputValue = screen.getByDisplayValue(value);
         assertInDocument(inputValue);
      });

      const applyBtn = screen.getByTestId("apply-filters-btn");
      await userEvent.click(applyBtn);

      const expectedEvent = {
         options: { history: "replace", scroll: false, shallow: false },
         queryString: "?f_search=test-123",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });

   it("LibraryFilters - category filters - test", async () => {
      const categories = dtestData.dLibraryEntryCategories();
      const models = ["mod-1", "mod-2", "mod-3"];

      getLibraryModelsMock.mockResolvedValue(models);

      const url = "/library";
      const searchParams = "f_categories=cat-1";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <LibraryFilters categories={categories} />,
         url,
         searchParams,
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const triggerBtn = screen.getByTestId("library-entry-filters-trigger");
      await userEvent.click(triggerBtn);

      const cat1 = screen.getByTestId("category-cat-1");
      await userEvent.click(cat1);

      const cat2 = screen.getByTestId("category-cat-2");
      await userEvent.click(cat2);

      const cat3 = screen.getByTestId("category-cat-3");
      await userEvent.click(cat3);

      const applyBtn = screen.getByTestId("apply-filters-btn");
      await userEvent.click(applyBtn);

      const expectedEvent = {
         options: { history: "replace", scroll: false, shallow: false },
         queryString: "?f_categories=cat-2,cat-3",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });

   it("LibraryFilters - model filters - test", async () => {
      const categories = dtestData.dLibraryEntryCategories();
      const models = ["mod-1", "mod-2", "mod-3"];
      getLibraryModelsMock.mockResolvedValue(models);

      const url = "/library";
      const searchParams = "f_models=mod-1";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <LibraryFilters categories={categories} />,
         url,
         searchParams,
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const triggerBtn = screen.getByTestId("library-entry-filters-trigger");
      await userEvent.click(triggerBtn);

      const cat1 = screen.getByTestId("model-mod-1");
      await userEvent.click(cat1);

      const cat2 = screen.getByTestId("model-mod-2");
      await userEvent.click(cat2);

      const cat3 = screen.getByTestId("model-mod-3");
      await userEvent.click(cat3);

      const applyBtn = screen.getByTestId("apply-filters-btn");
      await userEvent.click(applyBtn);

      const expectedEvent = {
         options: { history: "replace", scroll: false, shallow: false },
         queryString: "?f_models=mod-2,mod-3",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });
});
