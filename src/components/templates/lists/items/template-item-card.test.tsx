jest.mock("@/data/actions/collection");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
} from "@tests";
import mockRouter from "next-router-mock";

import { getTemplateCollectionIds } from "@/data/actions/collection";

import { TemplateItemCard } from "./template-item-card";

const getTemplateCollectionIdsMock =
   getTemplateCollectionIds as jest.MockedFunction<
      typeof getTemplateCollectionIds
   >;

const assertRendered = () => {
   const entryCard = screen.getByTestId("template-item-card");
   const viewDetailsTitle = screen.getByTestId("view-details-link-title");
   const categories = screen.getByTestId("categories");
   const createPromptBtn = screen.getByTestId(
      "create-prompt-from-template-btn"
   );
   const dropdownMenuBtn = screen.getByTestId("dropdown-menu-btn");

   assertInDocument(entryCard);
   assertInDocument(viewDetailsTitle);
   assertInDocument(categories);
   assertInDocument(createPromptBtn);
   assertInDocument(dropdownMenuBtn);
};

const assertDropdownMenuItemsRendered = () => {
   const viewDetailsLink = screen.getByTestId("view-details-link");
   const addToCollectionDialogMenuItem = screen.getByTestId(
      "show-add-to-collection-dialog"
   );
   const downloadMenuItem = screen.getByTestId("download-template-menu-item");

   assertInDocument(viewDetailsLink);
   assertInDocument(addToCollectionDialogMenuItem);
   assertInDocument(downloadMenuItem);
};

const assertDropdownMenuItemsNotRendered = () => {
   const viewDetailsLink = screen.queryByTestId("view-details-link");
   const addToCollectionDialog = screen.queryByTestId(
      "show-add-to-collection-dialog"
   );
   const downloadMenuItem = screen.queryByTestId("download-template-menu-item");

   assertNotInDocument(viewDetailsLink);
   assertNotInDocument(addToCollectionDialog);
   assertNotInDocument(downloadMenuItem);
};

const assertAddToCollectionDialogRendered = () => {
   const dialog = screen.getByTestId("add-to-collection-dialog");
   assertInDocument(dialog);
};

const assertAddToCollectionDialogNotRendered = () => {
   const dialog = screen.queryByTestId("add-to-collection-dialog");
   assertNotInDocument(dialog);
};

describe("TemplateItemCard rendering tests", () => {
   it("viewMode grid - rendered test", async () => {
      const collections = dtestData.dCollections();
      const descriptor = dtestData.dPromptTemplateDescriptor();

      const { container } = renderWithReactQuery(
         <TemplateItemCard descriptor={descriptor} collections={collections} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplateItemCard functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("title - view detail link clicked - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      const collections = dtestData.dCollections();

      renderWithReactQuery(
         <TemplateItemCard descriptor={descriptor} collections={collections} />
      );

      await waitFor(() => {
         assertRendered();
         assertDropdownMenuItemsNotRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const viewDetailsTitle = screen.getByTestId("view-details-link-title");
      userEvent.click(viewDetailsTitle);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/templates/${descriptor.id}`);
      });
   });

   it("dropdown - view detail link clicked - test", async () => {
      const descriptor = dtestData.dPromptTemplateDescriptor();
      const collections = dtestData.dCollections();

      renderWithReactQuery(
         <TemplateItemCard descriptor={descriptor} collections={collections} />
      );

      await waitFor(() => {
         assertRendered();
         assertDropdownMenuItemsNotRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const dropdownMenuBtn = screen.getByTestId("dropdown-menu-btn");
      userEvent.click(dropdownMenuBtn);

      await waitFor(() => {
         assertDropdownMenuItemsRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const viewDetailsLink = screen.getByTestId("view-details-link");
      userEvent.click(viewDetailsLink);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/templates/${descriptor.id}`);
      });
   });

   it("dropdown - show add to collection dialog - test", async () => {
      const collectionIds = dtestData.dCollectionIds();
      getTemplateCollectionIdsMock.mockResolvedValue(collectionIds);

      const descriptor = dtestData.dPromptTemplateDescriptor();
      const collections = dtestData.dCollections();

      renderWithReactQuery(
         <TemplateItemCard descriptor={descriptor} collections={collections} />
      );

      await waitFor(() => {
         assertRendered();
         assertDropdownMenuItemsNotRendered();
         assertAddToCollectionDialogNotRendered();
      });

      const dropdownMenuBtn = screen.getByTestId("dropdown-menu-btn");
      userEvent.click(dropdownMenuBtn);

      await waitFor(() => {
         assertDropdownMenuItemsRendered();
         assertAddToCollectionDialogNotRendered();
      });

      const addToCollectionDialogMenuItem = screen.getByTestId(
         "show-add-to-collection-dialog"
      );
      userEvent.click(addToCollectionDialogMenuItem);

      await waitFor(() => {
         assertAddToCollectionDialogRendered();
      });
   });
});
