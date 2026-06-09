jest.mock("@/data/actions/collection");

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
} from "@tests";

import {
   getCollectionPreviews,
   getPromptCollectionIds,
} from "@/data/actions/collection";

import { PromptMoreOptionsButton } from "./prompt-more-options-button";

const getCollectionPreviewsMock = getCollectionPreviews as jest.MockedFunction<
   typeof getCollectionPreviews
>;

const getPromptCollectionIdsMock =
   getPromptCollectionIds as jest.MockedFunction<typeof getPromptCollectionIds>;

const assertRendered = () => {
   const btn = screen.getByTestId("prompt-more-options-btn");
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

const assertDateStateOpen = () => {
   const triggerBtn = screen.getByTestId("more-options-trigger-btn");
   assertHasAttributeWithValue(triggerBtn, "data-state", "open");
};

const assertDateStateClosed = () => {
   const triggerBtn = screen.getByTestId("more-options-trigger-btn");
   assertHasAttributeWithValue(triggerBtn, "data-state", "false");
};

describe("PromptMoreOptionsButton rendering tests", () => {
   it("rendered test", async () => {
      const prompt = dtestData.dPrompt();

      const { container } = renderWithReactQuery(
         <PromptMoreOptionsButton prompt={prompt} />
      );

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("PromptMoreOptionsButton functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("trigger clicked - test", async () => {
      const prompt = dtestData.dPrompt();
      renderWithReactQuery(<PromptMoreOptionsButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
         assertDateStateClosed();
      });

      const triggerBtn = screen.getByTestId("more-options-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertContextMenuRendered();
         assertDateStateOpen();
      });
   });

   it("add to collection btn clicked - test", async () => {
      const collections = dtestData.dCollectionPreviews();
      getCollectionPreviewsMock.mockResolvedValue(collections);

      const collectionIds = dtestData.dCollectionIds();
      getPromptCollectionIdsMock.mockResolvedValue(collectionIds);

      const prompt = dtestData.dPrompt();

      renderWithReactQuery(<PromptMoreOptionsButton prompt={prompt} />);

      await waitFor(() => {
         assertRendered();
         assertContextMenuNotRendered();
         assertAddToCollectionDialogNotRendered();
         assertDateStateClosed();
      });

      const triggerBtn = screen.getByTestId("more-options-trigger-btn");
      await userEvent.click(triggerBtn);

      await waitFor(() => {
         assertContextMenuRendered();
         assertAddToCollectionDialogNotRendered();
         assertDateStateOpen();
      });

      const addToCollecitonBtn = screen.getByTestId(
         "add-to-collection-menu-item"
      );
      await userEvent.click(addToCollecitonBtn);

      await waitFor(() => {
         assertAddToCollectionDialogRendered();
         assertDateStateClosed();
      });
   });
});
