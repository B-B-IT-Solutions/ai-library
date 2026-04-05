import { screen, waitFor } from "@testing-library/dom";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assertInDocument, assertNotInDocument } from "@tests";
import mockRouter from "next-router-mock";

import { CollectionBreadcrumb } from "./collection-breadcrumb";

const assertRendered = () => {
   const breadcrumbs = screen.getByTestId("collection-breadcrumb");
   const rootLink = screen.getByTestId("root-link");

   assertInDocument(breadcrumbs);
   assertInDocument(rootLink);
};

const assertItemLinkRendered = () => {
   const itemLink = screen.getByTestId("item-link");
   assertInDocument(itemLink);
};

const assertItemLinkNotRendered = () => {
   const itemLink = screen.queryByTestId("item-link");
   assertNotInDocument(itemLink);
};

describe("CollectionBreadcrumb rendering test", () => {
   it("variant - new - test", async () => {
      const { container } = render(<CollectionBreadcrumb variant="new" />);

      await waitFor(() => {
         assertRendered();
         assertItemLinkNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("variant - view - test", async () => {
      const { container } = render(
         <CollectionBreadcrumb variant="view" label="Sammlung 1" />
      );

      await waitFor(() => {
         assertRendered();
         assertItemLinkNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("variant - edit - test", async () => {
      const { container } = render(
         <CollectionBreadcrumb
            variant="edit"
            label="Sammlung 2"
            collectionId="collection-id-1"
         />
      );

      await waitFor(() => {
         assertRendered();
         assertItemLinkRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("LibraryEntryBreadcrumb funtionality tests", () => {
   beforeEach(() => {
      mockRouter.push("/");
   });

   it("variant - new - root link clicked - test", async () => {
      render(<CollectionBreadcrumb variant="new" />);

      await waitFor(() => {
         assertRendered();
      });

      const rootLink = screen.getByTestId("root-link");
      await userEvent.click(rootLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/collections");
      });
   });

   it("variant - view - root link clicked - test", async () => {
      render(<CollectionBreadcrumb variant="view" label="Sammlung 1" />);

      await waitFor(() => {
         assertRendered();
      });

      const rootLink = screen.getByTestId("root-link");
      await userEvent.click(rootLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/collections");
      });
   });

   it("variant - edit - item link clicked - test", async () => {
      render(
         <CollectionBreadcrumb
            variant="edit"
            label="Sammlung 123"
            collectionId="collection-id-123"
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      const itemLink = screen.getByTestId("item-link");
      await userEvent.click(itemLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/collections/collection-id-123");
      });
   });
});
