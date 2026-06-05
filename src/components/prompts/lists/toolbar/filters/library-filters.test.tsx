jest.mock("use-debounce", () => ({
   useDebouncedCallback: <T extends (...args: unknown[]) => unknown>(
      callback: T
   ) => {
      return (...args: Parameters<T>) => callback(...args);
   },
}));

import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithRouter,
} from "@tests";

import { LibraryFilters } from "./library-filters";

const assertRendered = () => {
   const filters = screen.getByTestId("filters-trigger-btn");
   assertInDocument(filters);
};

const assertFiltersRendered = () => {
   const search = screen.getByTestId("search-filter");
   const categories = screen.getByTestId("categories-filter");
   const models = screen.getByTestId("models-filter");
   const resetBtn = screen.getByTestId("reset-btn");

   assertInDocument(search);
   assertInDocument(categories);
   assertInDocument(models);
   assertInDocument(resetBtn);
};

const assertFiltersNotRendered = () => {
   const search = screen.queryByTestId("search-filter");
   const categories = screen.queryByTestId("categories-filter");
   const models = screen.queryByTestId("models-filter");

   assertNotInDocument(search);
   assertNotInDocument(categories);
   assertNotInDocument(models);
};

const assertCategoriesEmptyRendered = () => {
   const empty = screen.getByTestId("categories-empty");
   assertInDocument(empty);
};

describe("LibraryFilters rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("filters empty - test", async () => {
      const url = "/templates";
      const searchParams = "";
      const { container } = renderWithRouter(
         <LibraryFilters categories={[]} models={[]} />,
         url,
         searchParams
      );

      await waitFor(() => {
         assertRendered();
         assertFiltersNotRendered();
      });

      const filtersBtn = screen.getByTestId("filters-trigger-btn");
      await userEvent.click(filtersBtn);

      await waitFor(() => {
         assertCategoriesEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("filters defined - test", async () => {
      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();

      const url = "/templates";
      const searchParams = "f_search=test-1";
      const { container } = renderWithRouter(
         <LibraryFilters categories={categories} models={models} />,
         url,
         searchParams
      );

      await waitFor(() => {
         assertRendered();
         assertFiltersNotRendered();
      });

      const filtersBtn = screen.getByTestId("filters-trigger-btn");
      await userEvent.click(filtersBtn);

      await waitFor(() => {
         assertFiltersRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("LibraryFilters functinality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("search filter input - test", async () => {
      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();

      const url = "/templates";
      const searchParams = "";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <LibraryFilters categories={categories} models={models} />,
         url,
         searchParams,
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const triggerBtn = screen.getByTestId("filters-trigger-btn");
      await userEvent.click(triggerBtn);

      const searchFilter = screen.getByTestId("search-filter");
      const input = within(searchFilter).getByTestId("input");

      const value = "test-123";
      await userEvent.type(input, value);

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalled();
      });

      const lastCall = onUrlUpdateFn.mock.calls.at(-1)![0]!;
      expect(lastCall.queryString).toContain("f_search=test-123");
   });

   it("category filters - test", async () => {
      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();

      const url = "/templates";
      const searchParams = "f_categories=cat-1";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <LibraryFilters categories={categories} models={models} />,
         url,
         searchParams,
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const triggerBtn = screen.getByTestId("filters-trigger-btn");
      await userEvent.click(triggerBtn);

      const cat1 = screen.getByTestId("category-cat-1");
      await userEvent.click(cat1);

      const cat2 = screen.getByTestId("category-cat-2");
      await userEvent.click(cat2);

      const cat3 = screen.getByTestId("category-cat-3");
      await userEvent.click(cat3);

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalled();
      });

      const lastCall = onUrlUpdateFn.mock.calls.at(-1)![0]!;
      expect(lastCall.queryString).toContain("f_categories=cat-2,cat-3");
   });

   it("model filters - test", async () => {
      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();

      const url = "/templates";
      const searchParams = "f_models=mod-1";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <LibraryFilters categories={categories} models={models} />,
         url,
         searchParams,
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const triggerBtn = screen.getByTestId("filters-trigger-btn");
      await userEvent.click(triggerBtn);

      const mod1 = screen.getByTestId("model-mod-1");
      await userEvent.click(mod1);

      const mod2 = screen.getByTestId("model-mod-2");
      await userEvent.click(mod2);

      const mod3 = screen.getByTestId("model-mod-3");
      await userEvent.click(mod3);

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalled();
      });

      const lastCall = onUrlUpdateFn.mock.calls.at(-1)![0]!;
      expect(lastCall.queryString).toContain("f_models=mod-2,mod-3");
   });

   it("reset btn clicked - test", async () => {
      const categories = dtestData.dTemplateCategories();
      const models = dtestData.dTemplateModels();

      const url = "/templates";
      const searchParams =
         "f_categories=cat-1&f_models=mod-1&f_search=test-123";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <LibraryFilters categories={categories} models={models} />,
         url,
         searchParams,
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const triggerBtn = screen.getByTestId("filters-trigger-btn");
      await userEvent.click(triggerBtn);

      const resetBtn = screen.getByTestId("reset-btn");
      await userEvent.click(resetBtn);

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalled();
      });

      const lastCall = onUrlUpdateFn.mock.calls.at(-1)![0]!;
      expect(lastCall.queryString).toContain("");
   });
});
