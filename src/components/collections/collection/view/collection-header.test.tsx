jest.mock("@/data/ts-queries/library");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
   renderWithRouter,
} from "@tests";
import mockRouter from "next-router-mock";

import { useDeleteCollection } from "@/data/ts-queries/library";

import { CollectionHeader } from "./collection-header";

const useDeleteCollectionMock = useDeleteCollection as jest.MockedFunction<
   typeof useDeleteCollection
>;

const mockDeleteMutate = jest.fn();

const setupMocks = () => {
   useDeleteCollectionMock.mockReturnValue({
      mutate: mockDeleteMutate,
      isPending: false,
   } as ReturnType<typeof useDeleteCollection>);
};

const assertRendered = () => {
   const header = screen.getByTestId("collection-header");
   const breadcrumb = screen.getByTestId("collection-breadcrumb");
   const overview = screen.getByTestId("overview");
   const actions = screen.getByTestId("actions");
   const createBtn = screen.getByTestId("create-template-btn");
   const moreOptionsBtn = screen.getByTestId("more-options-btn");

   assertInDocument(header);
   assertInDocument(breadcrumb);
   assertInDocument(overview);
   assertInDocument(actions);
   assertInDocument(createBtn);
   assertInDocument(moreOptionsBtn);
};

const assertPublicBadgeRendered = () => {
   const badge = screen.getByTestId("public-badge");
   assertInDocument(badge);
};

const assertPublicBadgeNotRendered = () => {
   const badge = screen.queryByTestId("public-badge");
   assertNotInDocument(badge);
};

describe("CollectionHeader rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      setupMocks();
   });

   it("isPublic true - badge shown - test", async () => {
      const collection = dtestData.dCollection(1);
      collection.isPublic = true;

      const { container } = renderWithReactQuery(
         <CollectionHeader collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
         assertPublicBadgeRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("isPublic false - badge hidden - test", async () => {
      const collection = dtestData.dCollection(1);
      collection.isPublic = false;

      const { container } = renderWithReactQuery(
         <CollectionHeader collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
         assertPublicBadgeNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("description null - test", async () => {
      const collection = dtestData.dCollection(1);
      collection.description = null;

      const { container } = renderWithReactQuery(
         <CollectionHeader collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CollectionHeader functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/collections/test-id");
      setupMocks();
   });

   it("create template btn clicked - navigates to /templates/new - test", async () => {
      const collection = dtestData.dCollection(1);
      renderWithRouter(<CollectionHeader collection={collection} />);

      await waitFor(() => {
         assertRendered();
      });

      const createBtn = screen.getByTestId("create-template-btn");
      await userEvent.click(createBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual("/templates/new");
      });
   });

   it("more options trigger clicked - edit and delete shown - test", async () => {
      const collection = dtestData.dCollection(1);
      renderWithRouter(<CollectionHeader collection={collection} />);

      await waitFor(() => {
         assertRendered();
         assertNotInDocument(screen.queryByTestId("edit-collection-menu-item"));
         assertNotInDocument(
            screen.queryByTestId("delete-collection-menu-item")
         );
      });

      const triggerBtn = screen.getByTestId("more-options-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("edit-collection-menu-item"));
         assertInDocument(screen.getByTestId("delete-collection-menu-item"));
      });
   });

   it("edit menu item clicked - navigates to collection edit - test", async () => {
      const collection = dtestData.dCollection(1);
      renderWithRouter(<CollectionHeader collection={collection} />);

      await waitFor(() => {
         assertRendered();
      });

      const triggerBtn = screen.getByTestId("more-options-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertInDocument(screen.getByTestId("edit-collection-menu-item"));
      });

      const editBtn = screen.getByTestId("edit-collection-menu-item");
      await userEvent.click(editBtn);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(
            `/collections/${collection.id}/edit`
         );
      });
   });
});
