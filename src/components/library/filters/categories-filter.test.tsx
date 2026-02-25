import { FC } from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { CategoriesFilter } from "./categories-filter";
import {
   LibraryEntryFilterContext,
   LibraryEntryFiltersHelper,
} from "./filters-context";

const filtersHelper = new LibraryEntryFiltersHelper({});

type WrapperProps = {
   categories: string[];
};

const TestWrapper: FC<WrapperProps> = ({ categories }) => {
   return (
      <LibraryEntryFilterContext.Provider value={filtersHelper}>
         <CategoriesFilter categories={categories} />
      </LibraryEntryFilterContext.Provider>
   );
};

const mockGetCategories = (values: string[]) => {
   return jest
      .spyOn(LibraryEntryFiltersHelper.prototype, "getCategories")
      .mockImplementation(() => values);
};

const mockSetCategories = () => {
   return jest.spyOn(LibraryEntryFiltersHelper.prototype, "setCategories");
};

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
      const getCategoriesFn = mockGetCategories([]);

      const { container } = renderWithRouter(<TestWrapper categories={[]} />);

      await waitFor(() => {
         assertCategoriesEmptyRendered();
         expect(getCategoriesFn).toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });

   it("CategoriesFilter - f_categories cat-1 - test", async () => {
      const categories = dtestData.dLibraryEntryCategories();
      const getCategoriesFn = mockGetCategories(["cat-1"]);

      const { container } = renderWithRouter(
         <TestWrapper categories={categories} />
      );

      await waitFor(() => {
         assertRendered();
         expect(getCategoriesFn).toHaveBeenCalled();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CategoriesFilter functinality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("CategoriesFilter - category selected - test", async () => {
      const categories = dtestData.dLibraryEntryCategories();

      const getCategoriesFn = mockGetCategories([]);
      const setCategoriesFn = mockSetCategories();

      renderWithRouter(<TestWrapper categories={categories} />);

      await waitFor(() => {
         assertRendered();
         expect(getCategoriesFn).toHaveBeenCalled();
         expect(setCategoriesFn).not.toHaveBeenCalled();
      });

      const cat1 = screen.getByTestId("category-cat-1");
      await userEvent.click(cat1);

      await waitFor(() => {
         expect(setCategoriesFn).toHaveBeenCalledTimes(1);
         expect(setCategoriesFn).toHaveBeenCalledWith(["cat-1"]);
      });
   });

   it("CategoriesFilter - category unselected - test", async () => {
      const categories = dtestData.dLibraryEntryCategories();

      const getCategoriesFn = mockGetCategories(["cat-1"]);
      const setCategoriesFn = mockSetCategories();

      renderWithRouter(<TestWrapper categories={categories} />);

      await waitFor(() => {
         assertRendered();
         expect(getCategoriesFn).toHaveBeenCalled();
         expect(setCategoriesFn).not.toHaveBeenCalled();
      });

      const cat1 = screen.getByTestId("category-cat-1");
      await userEvent.click(cat1);

      await waitFor(() => {
         expect(setCategoriesFn).toHaveBeenCalledTimes(1);
         expect(setCategoriesFn).toHaveBeenCalledWith([]);
      });
   });
});
