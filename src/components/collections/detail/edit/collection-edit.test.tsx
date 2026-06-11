jest.mock("@/data/actions/collection");
jest.mock("@/data/actions/prompt");
jest.mock("sonner");

import { getByTestId, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   dtestData,
   renderWithReactQuery,
   typeIntoInput,
   typeIntoTextArea,
} from "@tests";
import mockRouter from "next-router-mock";
import { toast } from "sonner";

import {
   createCollection,
   getCollectionPromptIds,
   updateCollection,
} from "@/data/actions/collection";
import { getPromptsPage } from "@/data/actions/prompt";
import { DCollection, DCollectionUpdate } from "@/data/types/domain/collection";
import { ActionResult } from "@/data/types/utils";

import { CollectionEdit } from "./collection-edit";
import { initCollection } from "./utils";

const getCollectionPromptIdsMock =
   getCollectionPromptIds as jest.MockedFunction<typeof getCollectionPromptIds>;

const getPromptsPageMock = getPromptsPage as jest.MockedFunction<
   typeof getPromptsPage
>;

const createCollectionMock = createCollection as jest.MockedFunction<
   typeof createCollection
>;
const updateCollectionMock = updateCollection as jest.MockedFunction<
   typeof updateCollection
>;
const toastMock = toast as jest.MockedFunction<typeof toast>;

const assertRendered = () => {
   const edit = screen.getByTestId("collection-edit");
   const breadcrumbs = screen.getByTestId("collection-breadcrumb");

   assertInDocument(edit);
   assertInDocument(breadcrumbs);
};

const assertBtnsRendered = () => {
   const headerActions = screen.getByTestId("header-actions");
   const headerCancelBtn = getByTestId(headerActions, "cancel-btn");
   const headerSaveBtn = getByTestId(headerActions, "save-btn");

   const footerActions = screen.getByTestId("footer-actions");
   const footerCancelBtn = getByTestId(footerActions, "cancel-btn");
   const footerSaveBtn = getByTestId(footerActions, "save-btn");

   assertInDocument(headerActions);
   assertInDocument(headerCancelBtn);
   assertInDocument(headerSaveBtn);

   assertInDocument(footerActions);
   assertInDocument(footerCancelBtn);
   assertInDocument(footerSaveBtn);
};

const assertCreateModeRendered = () => {
   const editForm = screen.getByTestId("collection-edit-form");
   const tabs = screen.getByTestId("mock-react-tabs-root");
   const tabTemplates = screen.getByTestId("tab-templates-btn");
   const tabOther = screen.getByTestId("tab-other-btn");

   assertInDocument(editForm);
   assertInDocument(tabs);
   expect(tabTemplates).toBeDisabled();
   expect(tabOther).toBeDisabled();
};

const assertEditModeRendered = () => {
   const tabs = screen.getByTestId("mock-react-tabs-root");
   const tabGeneral = screen.getByTestId("tab-general-btn");
   const tabTemplates = screen.getByTestId("tab-templates-btn");
   const tabOther = screen.getByTestId("tab-other-btn");

   assertInDocument(tabs);
   assertInDocument(tabGeneral);
   assertInDocument(tabTemplates);
   assertInDocument(tabOther);
   expect(tabTemplates).not.toBeDisabled();
   expect(tabOther).not.toBeDisabled();
};

const assertGeneralTabRendered = () => {
   const editForm = screen.getByTestId("collection-edit-form");
   const prompts = screen.queryByTestId("collection-prompts");
   const other = screen.queryByTestId("collection-other");

   assertInDocument(editForm);
   assertNotInDocument(prompts);
   assertNotInDocument(other);
};

const assertTemplatesTabRendered = () => {
   const prompts = screen.getByTestId("collection-prompts");
   const editForm = screen.queryByTestId("collection-edit-form");
   const other = screen.queryByTestId("collection-other");

   assertInDocument(prompts);
   assertNotInDocument(editForm);
   assertNotInDocument(other);
};

const assertOtherTabRendered = () => {
   const other = screen.getByTestId("collection-other");
   const editForm = screen.queryByTestId("collection-edit-form");
   const prompts = screen.queryByTestId("collection-prompts");

   assertInDocument(other);
   assertNotInDocument(editForm);
   assertNotInDocument(prompts);
};

describe("CollectionEdit rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("create mode - test", async () => {
      const { container } = renderWithReactQuery(<CollectionEdit />);

      await waitFor(() => {
         assertRendered();
         assertBtnsRendered();
         assertCreateModeRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("edit mode - test", async () => {
      const collection = dtestData.dCollection(1);

      const { container } = renderWithReactQuery(
         <CollectionEdit collection={collection} />
      );

      await waitFor(() => {
         assertRendered();
         assertBtnsRendered();
         assertEditModeRendered();
         assertGeneralTabRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CollectionEdit functionality tests", () => {
   beforeAll(() => {
      const promptIds = dtestData.dCollectionPromptIds();
      getCollectionPromptIdsMock.mockResolvedValue(promptIds);

      const page = dtestData.dPromptsPage();
      getPromptsPageMock.mockResolvedValue(page);
   });

   beforeEach(() => {
      jest.clearAllMocks();
      mockRouter.push("/");
   });

   it("tab switching - test", async () => {
      const collection = dtestData.dCollection(1);
      renderWithReactQuery(<CollectionEdit collection={collection} />);

      await waitFor(() => {
         assertRendered();
         assertEditModeRendered();
         assertGeneralTabRendered();
      });

      const tabTemplates = screen.getByTestId("tab-templates-btn");
      userEvent.click(tabTemplates);

      await waitFor(() => {
         assertTemplatesTabRendered();
      });

      const tabOther = screen.getByTestId("tab-other-btn");
      userEvent.click(tabOther);

      await waitFor(() => {
         assertOtherTabRendered();
      });

      const tabGeneral = screen.getByTestId("tab-general-btn");
      userEvent.click(tabGeneral);

      await waitFor(() => {
         assertGeneralTabRendered();
      });
   });

   it("create mode - save btn clicked - success - test", async () => {
      const collection = dtestData.dCollection(2);
      const result: ActionResult<DCollection> = {
         success: true,
         message: "Sammlung erfolgreich erstellt",
         data: collection,
      };
      createCollectionMock.mockResolvedValue(result);

      render(<CollectionEdit />);

      await waitFor(() => {
         assertRendered();
         expect(createCollectionMock).not.toHaveBeenCalled();
      });

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");
      await userEvent.click(saveBtn);

      await waitFor(() => {
         expect(createCollectionMock).not.toHaveBeenCalled();
      });

      await typeIntoInput("name", "Neue Sammlung");
      await userEvent.click(saveBtn);

      const initValues = initCollection();
      const expectedPayload: DCollectionUpdate = {
         ...initValues,
         name: initValues.name + "Neue Sammlung",
      };

      await waitFor(() => {
         expect(createCollectionMock).toHaveBeenCalledTimes(1);
         expect(createCollectionMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual(`/collections/${collection.id}`);
      });
   });

   it("create mode - save btn clicked - failed - test", async () => {
      const result: ActionResult<DCollection> = {
         success: false,
         message: "Fehler beim Erstellen",
      };
      createCollectionMock.mockResolvedValue(result);

      render(<CollectionEdit />);

      await waitFor(() => {
         assertRendered();
         expect(createCollectionMock).not.toHaveBeenCalled();
      });

      await typeIntoInput("name", "Neue Sammlung 123");

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");
      await userEvent.click(saveBtn);

      const initValues = initCollection();
      const expectedPayload: DCollectionUpdate = {
         ...initValues,
         name: initValues.name + "Neue Sammlung 123",
      };

      await waitFor(() => {
         expect(createCollectionMock).toHaveBeenCalledTimes(1);
         expect(createCollectionMock).toHaveBeenCalledWith(expectedPayload);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.pathname).toEqual("/");
      });
   });

   it("edit mode - save btn clicked - success - test", async () => {
      const collection = dtestData.dCollection(1);
      const result: ActionResult<DCollection> = {
         success: true,
         message: "Sammlung erfolgreich gespeichert",
         data: collection,
      };
      updateCollectionMock.mockResolvedValue(result);

      render(<CollectionEdit collection={collection} />);

      await waitFor(() => {
         assertRendered();
         expect(updateCollectionMock).not.toHaveBeenCalled();
      });

      await typeIntoInput("name", " aktualisiert");
      await typeIntoTextArea("description", " neu");

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");
      await userEvent.click(saveBtn);

      const initValues = initCollection(collection);
      const expectedPayload: DCollectionUpdate = {
         ...initValues,
         name: initValues.name + " aktualisiert",
         description: initValues.description + " neu",
      };

      await waitFor(() => {
         expect(updateCollectionMock).toHaveBeenCalledTimes(1);
         expect(updateCollectionMock).toHaveBeenCalledWith(
            collection.id,
            expectedPayload
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });

   it("edit mode - save btn clicked - failed - test", async () => {
      const collection = dtestData.dCollection(1);
      const result: ActionResult<DCollection> = {
         success: false,
         message: "Fehler beim Speichern",
         data: collection,
      };
      updateCollectionMock.mockResolvedValue(result);

      render(<CollectionEdit collection={collection} />);

      await waitFor(() => {
         assertRendered();
         expect(updateCollectionMock).not.toHaveBeenCalled();
      });

      const headerActions = screen.getByTestId("header-actions");
      const saveBtn = getByTestId(headerActions, "save-btn");
      await userEvent.click(saveBtn);

      const initValues = initCollection(collection);
      const expectedPayload: DCollectionUpdate = {
         ...initValues,
      };

      await waitFor(() => {
         expect(updateCollectionMock).toHaveBeenCalledTimes(1);
         expect(updateCollectionMock).toHaveBeenCalledWith(
            collection.id,
            expectedPayload
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(result.message);
         expect(mockRouter.refresh).toHaveBeenCalledTimes(1);
      });
   });

   it("create mode - cancel btn clicked - test", async () => {
      renderWithReactQuery(<CollectionEdit />);

      await waitFor(() => {
         assertRendered();
         assertBtnsRendered();
      });

      const headerActions = screen.getByTestId("header-actions");
      const cancelBtn = getByTestId(headerActions, "cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual("/collections");
      });
   });

   it("edit mode - cancel btn clicked - test", async () => {
      const collection = dtestData.dCollection();

      renderWithReactQuery(<CollectionEdit collection={collection} />);

      await waitFor(() => {
         assertRendered();
         assertBtnsRendered();
      });

      const headerActions = screen.getByTestId("header-actions");
      const cancelBtn = getByTestId(headerActions, "cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(mockRouter.asPath).toEqual(`/collections/${collection.id}`);
      });
   });
});
