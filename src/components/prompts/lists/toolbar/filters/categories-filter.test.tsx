jest.mock("use-debounce", () => ({
   useDebouncedCallback: <T extends (...args: unknown[]) => unknown>(
      callback: T
   ) => {
      return (...args: Parameters<T>) => callback(...args);
   },
}));

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { CategoriesFilter } from "./categories-filter";

const assertRendered = () => {
   const filter = screen.getByTestId("categories-filter");
   assertInDocument(filter);
};

const assertCategoriesEmptyRendered = () => {
   const empty = screen.getByTestId("categories-empty");
   assertInDocument(empty);
};

describe("CategoriesFilter rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("CategoriesFilter - categories empty - test", async () => {
      const { container } = renderWithRouter(
         <CategoriesFilter categories={[]} />,
         "/",
         ""
      );

      await waitFor(() => {
         assertCategoriesEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("CategoriesFilter - f_categories cat-1 - test", async () => {
      const categories = dtestData.dTemplateCategories();

      const { container } = renderWithRouter(
         <CategoriesFilter categories={categories} />,
         "/",
         "f_categories=cat-1"
      );

      await waitFor(() => {
         assertRendered();
         const cat1Checkbox = screen.getByTestId("category-cat-1");
         expect(cat1Checkbox).toBeChecked();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CategoriesFilter functinality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("CategoriesFilter - category selected - test", async () => {
      const categories = dtestData.dTemplateCategories();
      const onUrlUpdateFn = jest.fn();

      renderWithRouter(
         <CategoriesFilter categories={categories} />,
         "/",
         "",
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const cat1 = screen.getByTestId("category-cat-1");
      await userEvent.click(cat1);

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalled();
      });

      const lastCall = onUrlUpdateFn.mock.calls.at(-1)![0]!;
      expect(lastCall.queryString).toContain("f_categories=cat-1");
   });

   it("CategoriesFilter - category unselected - test", async () => {
      const categories = dtestData.dTemplateCategories();
      const onUrlUpdateFn = jest.fn();

      renderWithRouter(
         <CategoriesFilter categories={categories} />,
         "/",
         "f_categories=cat-1",
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const cat1 = screen.getByTestId("category-cat-1");
      await userEvent.click(cat1);

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalled();
      });

      const lastCall = onUrlUpdateFn.mock.calls.at(-1)![0]!;
      expect(lastCall.queryString).not.toContain("cat-1");
   });
});
