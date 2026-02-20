jest.mock("@/data/actions/library");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, renderWithRouter } from "@tests";

import { getLibraryCategories } from "@/data/actions/library";

import { CategoriesFilter } from "./categories-filter";

const getLibraryCategoriesMock = getLibraryCategories as jest.MockedFunction<
   typeof getLibraryCategories
>;

const assertRendered = () => {
   const filter = screen.getByTestId("categories-filter");
   assertInDocument(filter);
};

const assertCategoriesEmptyRendered = () => {
   const empty = screen.getByTestId("categories-empty");
   assertInDocument(empty);
};

describe("CategoriesFilter rendering tests", () => {
   it("CategoriesFilter - categories empty - test", async () => {
      getLibraryCategoriesMock.mockResolvedValue([]);

      const url = "/library";
      const searchParams = "";
      const { container } = renderWithRouter(
         <CategoriesFilter />,
         url,
         searchParams
      );

      await waitFor(() => {
         assertCategoriesEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("CategoriesFilter - f_categories cat-1 - test", async () => {
      const categories = ["cat-1", "cat-2", "cat-3"];
      getLibraryCategoriesMock.mockResolvedValue(categories);

      const url = "/library";
      const searchParams = "f_categories=cat-1";
      const { container } = renderWithRouter(
         <CategoriesFilter />,
         url,
         searchParams
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CategoriesFilter functinality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("CategoriesFilter - category selected - test", async () => {
      const categories = ["cat-1", "cat-2", "cat-3"];
      getLibraryCategoriesMock.mockResolvedValue(categories);

      const url = "/library";
      const searchParams = "";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(<CategoriesFilter />, url, searchParams, onUrlUpdateFn);

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const cat1 = screen.getByTestId("category-cat-1");
      await userEvent.click(cat1);

      const expectedEvent = {
         options: { history: "replace", scroll: false, shallow: false },
         queryString: "?f_categories=cat-1",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });

   it("CategoriesFilter - category unselected - test", async () => {
      const categories = ["cat-1", "cat-2", "cat-3"];
      getLibraryCategoriesMock.mockResolvedValue(categories);

      const url = "/library";
      const searchParams = "f_categories=cat-1";
      const onUrlUpdateFn = jest.fn();
      renderWithRouter(<CategoriesFilter />, url, searchParams, onUrlUpdateFn);

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      const cat1 = screen.getByTestId("category-cat-1");
      await userEvent.click(cat1);

      const expectedEvent = {
         options: { history: "replace", scroll: false, shallow: false },
         queryString: "",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const event = onUrlUpdateFn.mock.calls[0]![0]!;
      expect(event.queryString).toEqual(expectedEvent.queryString);
      expect(event.options).toEqual(expectedEvent.options);
   });
});
