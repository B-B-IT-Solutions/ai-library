import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, dtestData, renderWithRouter } from "@tests";

import { CategoriesFilter } from "./categories-filter";

const assertRendered = () => {
   const filter = screen.getByTestId("categories-filter");
   const cat1 = screen.getByTestId("category-category-1");

   assertInDocument(filter);
   assertInDocument(cat1);
};

describe("CategoriesFilter rendering tests", () => {
   it("filter not select - test", async () => {
      const categories = dtestData.dCatalogEntryCategories(3);
      const { container } = renderWithRouter(
         <CategoriesFilter categories={categories} totalElements={10} />,
         "/explore"
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("filter select - test", async () => {
      const categories = dtestData.dCatalogEntryCategories(3);
      const { container } = renderWithRouter(
         <CategoriesFilter categories={categories} totalElements={42} />,
         "/explore",
         "f_categories=category-1"
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CategoriesFilter functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("category selected - test", async () => {
      const categories = dtestData.dCatalogEntryCategories(3);

      const onUrlUpdateFn = jest.fn();
      const onSelectFn = jest.fn();

      renderWithRouter(
         <CategoriesFilter
            categories={categories}
            totalElements={10}
            onSelect={onSelectFn}
         />,
         "/explore",
         "",
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
         expect(onSelectFn).not.toHaveBeenCalled();
      });

      const cat1 = screen.getByTestId("category-category-1");

      await userEvent.click(cat1);

      const expectedPayload = {
         options: {
            history: "replace",
            scroll: false,
            shallow: false,
         },
         queryString: "?f_categories=category-1",
      };

      await waitFor(() => {
         expect(onUrlUpdateFn).toHaveBeenCalled();
         expect(onUrlUpdateFn).toHaveBeenLastCalledWith(
            expect.objectContaining(expectedPayload)
         );

         expect(onSelectFn).toHaveBeenCalled();
      });
   });

   it("category deselected - test", async () => {
      const categories = dtestData.dCatalogEntryCategories(3);

      const onUrlUpdateFn = jest.fn();
      const onSelectFn = jest.fn();

      renderWithRouter(
         <CategoriesFilter
            categories={categories}
            totalElements={10}
            onSelect={onSelectFn}
         />,
         "/explore",
         "f_categories=category-1",
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
         expect(onSelectFn).not.toHaveBeenCalled();
      });

      const cat1 = screen.getByTestId("category-category-1");

      await userEvent.click(cat1);

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
         expect(onSelectFn).toHaveBeenCalled();
      });
   });

   it("category all - test", async () => {
      const categories = dtestData.dCatalogEntryCategories(3);

      const onUrlUpdateFn = jest.fn();
      const onSelectFn = jest.fn();

      renderWithRouter(
         <CategoriesFilter
            categories={categories}
            totalElements={10}
            onSelect={onSelectFn}
         />,
         "/explore",
         "f_categories=category-1&f_categories=category-2",
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
         expect(onSelectFn).not.toHaveBeenCalled();
      });

      const catAll = screen.getByTestId("category-all");

      await userEvent.click(catAll);

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
         expect(onSelectFn).toHaveBeenCalled();
      });
   });
});
