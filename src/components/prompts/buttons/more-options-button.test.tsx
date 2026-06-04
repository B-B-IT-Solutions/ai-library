jest.mock("@/data/actions/collection");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
} from "@tests";

import { getTemplateCollectionIds } from "@/data/actions/collection";

import { MoreOptionsButton } from "./more-options-button";

const getTemplateCollectionIdsMock =
   getTemplateCollectionIds as jest.MockedFunction<
      typeof getTemplateCollectionIds
   >;

const assertRendered = () => {
   const btn = screen.getByTestId("more-options-btn");
   const triggerBtn = screen.getByTestId("more-options-trigger-btn");

   assertInDocument(btn);
   assertInDocument(triggerBtn);
};

const assertContextMenuRendered = () => {
   const viewBtn = screen.getByTestId("view-prompt-menu-item");
   const editBtn = screen.getByTestId("edit-prompt-menu-item");
   const addToCollectionBtn = screen.getByTestId("add-to-collection-menu-item");
   const downloadBtn = screen.getByTestId("download-prompt-menu-item");
   const deleteBtn = screen.getByTestId("delete-prompt-menu-item");

   assertInDocument(viewBtn);
   assertInDocument(editBtn);
   assertInDocument(addToCollectionBtn);
   assertInDocument(downloadBtn);
   assertInDocument(deleteBtn);
};

const assertContextMenuNotRendered = () => {
   const viewBtn = screen.queryByTestId("view-prompt-menu-item");
   const editBtn = screen.queryByTestId("edit-prompt-menu-item");
   const addToCollectionBtn = screen.queryByTestId(
      "add-to-collection-menu-item"
   );
   const downloadBtn = screen.queryByTestId("download-prompt-menu-item");
   const deleteBtn = screen.queryByTestId("delete-prompt-menu-item");

   assertNotInDocument(viewBtn);
   assertNotInDocument(editBtn);
   assertNotInDocument(addToCollectionBtn);
   assertNotInDocument(downloadBtn);
   assertNotInDocument(deleteBtn);
};

const assertAddToCollectionDialogRendered = () => {
   const dialog = screen.getByTestId("add-to-collection-dialog");
   assertInDocument(dialog);
};

const assertAddToCollectionDialogNotRendered = () => {
   const dialog = screen.queryByTestId("add-to-collection-dialog");
   assertNotInDocument(dialog);
};

describe("MoreOptionsButton rendering tests", () => {
   it("rendered test", async () => {
      const prompt = dtestData.dPrompt();
      const collections = dtestData.dCollections();

      const { container } = renderWithReactQuery(
         <MoreOptionsButton prompt={prompt} collections={collections} />
      );

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("MoreOptionsButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("trigger clicked - test", async () => {
      const prompt = dtestData.dPrompt();
      renderWithReactQuery(
         <MoreOptionsButton prompt={prompt} collections={[]} />
      );

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
      });

      const triggerBtn = screen.getByTestId("more-options-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertContextMenuRendered();
      });
   });

   it("add to collection btn clicked - test", async () => {
      const collectionIds = dtestData.dCollectionIds();
      getTemplateCollectionIdsMock.mockResolvedValue(collectionIds);

      const prompt = dtestData.dPrompt();
      const collections = dtestData.dCollections();

      renderWithReactQuery(
         <MoreOptionsButton prompt={prompt} collections={collections} />
      );

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
         assertAddToCollectionDialogNotRendered();
      });

      const triggerBtn = screen.getByTestId("more-options-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertContextMenuRendered();
         assertAddToCollectionDialogNotRendered();
      });

      const addToCollecitonBtn = screen.getByTestId(
         "add-to-collection-menu-item"
      );
      userEvent.click(addToCollecitonBtn);

      await waitFor(() => {
         assertAddToCollectionDialogRendered();
      });
   });
});
