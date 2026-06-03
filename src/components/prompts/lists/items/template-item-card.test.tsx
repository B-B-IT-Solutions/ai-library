jest.mock("@/data/actions/collection");

import React from "react";
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
   const usePromptBtn = screen.getByTestId("use-prompt-btn");
   const editPromptBtn = screen.getByTestId("edit-prompt-btn");
   const dropdownMenuBtn = screen.getByTestId("dropdown-menu-btn");

   assertInDocument(entryCard);
   assertInDocument(viewDetailsTitle);
   assertInDocument(categories);
   assertInDocument(usePromptBtn);
   assertInDocument(editPromptBtn);
   assertInDocument(dropdownMenuBtn);
};

const assertDropdownMenuItemsRendered = () => {
   const viewDetailsLink = screen.getByTestId("view-details-link");
   const addToCollectionDialogMenuItem = screen.getByTestId(
      "show-add-to-collection-dialog"
   );
   const downloadMenuItem = screen.getByTestId("download-prompt-menu-item");

   assertInDocument(viewDetailsLink);
   assertInDocument(addToCollectionDialogMenuItem);
   assertInDocument(downloadMenuItem);
};

const assertDropdownMenuItemsNotRendered = () => {
   const viewDetailsLink = screen.queryByTestId("view-details-link");
   const addToCollectionDialog = screen.queryByTestId(
      "show-add-to-collection-dialog"
   );
   const downloadMenuItem = screen.queryByTestId("download-prompt-menu-item");

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
   it("collectionId undefined - test", async () => {
      const collections = dtestData.dCollections();
      const prompt = dtestData.dPrompt();

      const { container } = renderWithReactQuery(
         <TemplateItemCard prompt={prompt} collections={collections} />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("collectionId defined - test", async () => {
      const collections = dtestData.dCollections();
      const prompt = dtestData.dPrompt();
      const collection = dtestData.dCollection();

      const { container } = renderWithReactQuery(
         <TemplateItemCard
            prompt={prompt}
            collections={collections}
            collectionId={collection.id}
         />
      );

      await waitFor(() => {
         assertRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("TemplateItemCard ref tests", () => {
   it("ref is forwarded to the Item DOM element - test", async () => {
      const ref = React.createRef<HTMLDivElement>();
      const prompt = dtestData.dPrompt();
      const collections = dtestData.dCollections();

      renderWithReactQuery(
         <TemplateItemCard
            prompt={prompt}
            collections={collections}
            ref={ref}
         />
      );

      await waitFor(() => {
         const item = screen.getByTestId("template-item-card");
         expect(ref.current).not.toBeNull();
         expect(ref.current).toBe(item);
      });
   });
});

describe("TemplateItemCard functionality tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      mockRouter.push("/");
   });

   it("title - view detail link clicked - collectionId undefined - test", async () => {
      const prompt = dtestData.dPrompt();
      const collections = dtestData.dCollections();

      renderWithReactQuery(
         <TemplateItemCard prompt={prompt} collections={collections} />
      );

      await waitFor(() => {
         assertRendered();
         assertDropdownMenuItemsNotRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const viewDetailsTitle = screen.getByTestId("view-details-link-title");
      userEvent.click(viewDetailsTitle);

      await waitFor(() => {
         expect(mockRouter.pathname).toEqual(`/templates/${prompt.id}`);
      });
   });

   it("title - view detail link clicked - collectionId defined - test", async () => {
      const prompt = dtestData.dPrompt();
      const collections = dtestData.dCollections();
      const collection = dtestData.dCollection();

      renderWithReactQuery(
         <TemplateItemCard
            prompt={prompt}
            collections={collections}
            collectionId={collection.id}
         />
      );

      await waitFor(() => {
         assertRendered();
         assertDropdownMenuItemsNotRendered();
         expect(mockRouter.pathname).toEqual("/");
      });

      const viewDetailsTitle = screen.getByTestId("view-details-link-title");
      userEvent.click(viewDetailsTitle);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual(
            `/templates/${prompt.id}?collectionId=${collection.id}`
         );
      });
   });

   it("dropdown - view detail link clicked - collectionId undefined - test", async () => {
      const prompt = dtestData.dPrompt();
      const collections = dtestData.dCollections();

      renderWithReactQuery(
         <TemplateItemCard prompt={prompt} collections={collections} />
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
         expect(mockRouter.pathname).toEqual(`/templates/${prompt.id}`);
      });
   });

   it("dropdown - view detail link clicked - collectionId defined - test", async () => {
      const prompt = dtestData.dPrompt();
      const collections = dtestData.dCollections();
      const collection = dtestData.dCollection();

      renderWithReactQuery(
         <TemplateItemCard
            prompt={prompt}
            collections={collections}
            collectionId={collection.id}
         />
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
         expect(mockRouter.asPath).toEqual(
            `/templates/${prompt.id}?collectionId=${collection.id}`
         );
      });
   });

   it("dropdown - show add to collection dialog - test", async () => {
      const collectionIds = dtestData.dCollectionIds();
      getTemplateCollectionIdsMock.mockResolvedValue(collectionIds);

      const prompt = dtestData.dPrompt();
      const collections = dtestData.dCollections();

      renderWithReactQuery(
         <TemplateItemCard prompt={prompt} collections={collections} />
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
