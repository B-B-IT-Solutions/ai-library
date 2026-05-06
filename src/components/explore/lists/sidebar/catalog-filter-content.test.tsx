import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithRouter,
} from "@tests";

import { CatalogFilterContent } from "./catalog-filter-content";

const assertRendered = () => {
   const filters = screen.getByTestId("catalog-entry-filters");
   const categories = screen.getByTestId("categories-filter");

   assertInDocument(filters);
   assertInDocument(categories);
};

const assertResetBtnRendered = () => {
   const resetBtn = screen.getByTestId("reset-filters-btn");
   assertInDocument(resetBtn);
};

const assertResetBtnNotRendered = () => {
   const resetBtn = screen.queryByTestId("reset-filters-btn");
   assertNotInDocument(resetBtn);
};

describe("CatalogFilterContent rendering tests", () => {
   it("without filters - test", async () => {
      const categories = dtestData.dCatalogEntryCategories(3);

      const { container } = renderWithRouter(
         <CatalogFilterContent categories={categories} totalElements={21} />,
         "/explore"
      );

      await waitFor(() => {
         assertRendered();
         assertResetBtnNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("search filter - test", async () => {
      const categories = dtestData.dCatalogEntryCategories(3);

      const { container } = renderWithRouter(
         <CatalogFilterContent categories={categories} totalElements={20} />,
         "/explore",
         "f_search=test"
      );

      await waitFor(() => {
         assertRendered();
         assertResetBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("categories filter - test", async () => {
      const categories = dtestData.dCatalogEntryCategories(3);

      const { container } = renderWithRouter(
         <CatalogFilterContent categories={categories} totalElements={20} />,
         "/explore",
         "f_categories=category-1"
      );

      await waitFor(() => {
         assertRendered();
         assertResetBtnRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CatalogFilterContent interaction tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("reset btn clicked - test", async () => {
      const categories = dtestData.dCatalogEntryCategories(3);

      const onUrlUpdateFn = jest.fn();

      renderWithRouter(
         <CatalogFilterContent categories={categories} totalElements={20} />,
         "/explore",
         "f_search=test&f_categories=category-1",
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         assertResetBtnRendered();
      });

      const resetBtn = screen.getByTestId("reset-filters-btn");
      await userEvent.click(resetBtn);

      const expectedPayload = {
         options: {
            history: "replace",
            scroll: false,
            shallow: false,
         },
         queryString: "",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalled();
         expect(onUrlUpdateFn).toHaveBeenLastCalledWith(
            expect.objectContaining(expectedPayload)
         );
      });
   });

   it("onSelect callback - test", async () => {
      const categories = dtestData.dCatalogEntryCategories(3);

      const onSelectFn = jest.fn();

      renderWithRouter(
         <CatalogFilterContent
            categories={categories}
            totalElements={10}
            onSelect={onSelectFn}
         />,
         "/explore"
      );

      await waitFor(() => {
         assertRendered();
         expect(onSelectFn).not.toHaveBeenCalled();
      });

      const cat1 = screen.getByTestId("category-category-1");

      await userEvent.click(cat1);

      await waitFor(() => {
         expect(onSelectFn).toHaveBeenCalled();
      });
   });
});
