jest.mock("use-debounce", () => ({
   useDebouncedCallback: <T extends (...args: unknown[]) => unknown>(
      callback: T
   ) => {
      return (...args: Parameters<T>) => callback(...args);
   },
}));

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertChecked,
   assertInDocument,
   assertNotChecked,
   dtestData,
   renderWithRouter,
} from "@tests";

import { CollectionsFilter } from "./collections-filter";

const assertRendered = () => {
   const filter = screen.getByTestId("collections-filter");
   assertInDocument(filter);
};

const assertEmptyRendered = () => {
   const empty = screen.getByTestId("collections-empty");
   assertInDocument(empty);
};

const assertOptionChecked = (id: string) => {
   const checkBox = screen.getByTestId(`collection-${id}`);
   assertInDocument(checkBox);
   assertChecked(checkBox);
};

const assertOptionNotChecked = (id: string) => {
   const checkBox = screen.getByTestId(`collection-${id}`);
   assertInDocument(checkBox);
   assertNotChecked(checkBox);
};

describe("CollectionsFilter rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collections empty - test", async () => {
      const { container } = renderWithRouter(
         <CollectionsFilter collections={[]} />,
         "/",
         ""
      );

      await waitFor(() => {
         assertEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("collections with selection - test", async () => {
      const collections = dtestData.dCollections(3);
      const col0 = collections[0];

      const { container } = renderWithRouter(
         <CollectionsFilter collections={collections} />,
         "/",
         `f_collectionIds=${col0.id}`
      );

      await waitFor(() => {
         assertRendered();
         assertOptionChecked(col0.id);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CollectionsFilter functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("collection selected - test", async () => {
      const collections = dtestData.dCollections(3);
      const onUrlUpdateFn = jest.fn();

      renderWithRouter(
         <CollectionsFilter collections={collections} />,
         "/",
         "",
         onUrlUpdateFn
      );

      const col0 = collections[0];
      await waitFor(() => {
         assertRendered();
         assertOptionNotChecked(col0.id);
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      await userEvent.click(screen.getByTestId(`collection-${col0.id}`));

      await waitFor(() => {
         assertOptionChecked(col0.id);
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const lastCall = onUrlUpdateFn.mock.calls.at(-1)![0]!;
      expect(lastCall.queryString).toContain(`f_collectionIds=${col0.id}`);
   });

   it("collection unselected - test", async () => {
      const collections = dtestData.dCollections(3);
      const col0 = collections[0];

      const onUrlUpdateFn = jest.fn();
      renderWithRouter(
         <CollectionsFilter collections={collections} />,
         "/",
         `f_collectionIds=${col0.id}`,
         onUrlUpdateFn
      );

      await waitFor(() => {
         assertRendered();
         assertOptionChecked(col0.id);
         expect(onUrlUpdateFn).not.toHaveBeenCalled();
      });

      await userEvent.click(screen.getByTestId(`collection-${col0.id}`));

      await waitFor(() => {
         assertOptionNotChecked(col0.id);
         expect(onUrlUpdateFn).toHaveBeenCalledTimes(1);
      });

      const lastCall = onUrlUpdateFn.mock.calls.at(-1)![0]!;
      expect(lastCall.queryString).not.toContain(col0.id);
   });
});
