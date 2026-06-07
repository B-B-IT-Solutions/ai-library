jest.mock("@/data/ts-queries/library");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertHasAttributeWithValue,
   assertInDocument,
   assertNotInDocument,
   ctestData,
   dtestData,
   renderWithReactQuery,
} from "@tests";
import { toast } from "sonner";

import {
   useCreateCollection,
   useLoadPromptCollectionIds,
   useUpdatePromptCollections,
} from "@/data/ts-queries/library";
import {
   LoadCollectionIdsParams,
   UpdateCollectionIdsParams,
} from "@/data/ts-queries/library/types";
import { ActionResult } from "@/data/types/utils";

import { AddToCollectionDialog } from "./add-to-collection-dialog";

type UseUpdatePromptCollectionsResult = ReturnType<
   typeof useUpdatePromptCollections
>;

type UseCreateCollectionResult = ReturnType<typeof useCreateCollection>;

type UseLoadPromptCollectionIdsResult = ReturnType<
   typeof useLoadPromptCollectionIds
>;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const useLoadPromptCollectionIdsMock =
   useLoadPromptCollectionIds as jest.MockedFunction<
      typeof useLoadPromptCollectionIds
   >;

const useCreateCollectionMock = useCreateCollection as jest.MockedFunction<
   typeof useCreateCollection
>;

const useUpdatePromptCollectionsMock =
   useUpdatePromptCollections as jest.MockedFunction<
      typeof useUpdatePromptCollections
   >;

const updateMutationResultMock = (
   mutateFn = jest.fn()
): UseUpdatePromptCollectionsResult => {
   const result = ctestData.useMutationResultMock(mutateFn);
   return result as UseUpdatePromptCollectionsResult;
};

const createMutationResultMock = (): UseCreateCollectionResult => {
   const result = ctestData.useMutationResultMock();
   return result as UseCreateCollectionResult;
};

const mutationObserverLoadingResultMock =
   (): UseUpdatePromptCollectionsResult => {
      const result = ctestData.useMutationObserverLoadingResult();
      return result as unknown as UseUpdatePromptCollectionsResult;
   };

const queryResultMock = (
   data: string[] | undefined = undefined,
   isLoading = false
): UseLoadPromptCollectionIdsResult => {
   return { data, isLoading } as UseLoadPromptCollectionIdsResult;
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("add-to-collection-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("add-to-collection-dialog");
   assertNotInDocument(dialog);
};

const assertCreateCollectionDialogRendered = () => {
   const createDialog = screen.getByTestId("create-library-collection-dialog");
   assertInDocument(createDialog);
};

const assertCreateCollectionDialogNotRendered = () => {
   const createDialog = screen.queryByTestId(
      "create-library-collection-dialog"
   );
   assertNotInDocument(createDialog);
};

const assertEntityCollectionIdsLoadingRendered = () => {
   const loading = screen.getByTestId("collections-loading");
   assertInDocument(loading);
};

const assertCollectionsEmptyRendered = () => {
   const empty = screen.getByTestId("collections-empty");
   assertInDocument(empty);
};

const assertSaveBtnDisabled = () => {
   const saveBtn = screen.getByTestId("save-btn");
   assertHasAttributeWithValue(saveBtn, "disabled", "");
};

const assertEntryCollectionIdsLoaded = (entryId: string, enabled: boolean) => {
   const expectedParams: LoadCollectionIdsParams = {
      entryId,
      enabled,
   };
   expect(useLoadPromptCollectionIdsMock).toHaveBeenCalledTimes(1);
   expect(useLoadPromptCollectionIdsMock).toHaveBeenCalledWith(expectedParams);
};

describe("AddToCollectionDialog rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();

      const mutationResult = createMutationResultMock();
      useCreateCollectionMock.mockReturnValue(mutationResult);
   });

   it("open true - test", async () => {
      const mutationResult = updateMutationResultMock();
      const queryResult = queryResultMock();

      useUpdatePromptCollectionsMock.mockReturnValue(mutationResult);
      useLoadPromptCollectionIdsMock.mockReturnValue(queryResult);

      const prompt = dtestData.dPrompt();
      const allCollections = dtestData.dCollections(6);
      allCollections[0].color = null;

      const { container } = renderWithReactQuery(
         <AddToCollectionDialog
            prompt={prompt}
            collections={allCollections}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertEntryCollectionIdsLoaded(prompt.id, true);
      });

      expect(container).toMatchSnapshot();
   });

   it("open true - isLoading true - test", async () => {
      const entryCollectionIds = dtestData.dCollectionIds(3);
      const mutationResult = updateMutationResultMock();
      const queryResult = queryResultMock(entryCollectionIds, true);

      useUpdatePromptCollectionsMock.mockReturnValue(mutationResult);
      useLoadPromptCollectionIdsMock.mockReturnValue(queryResult);

      const prompt = dtestData.dPrompt();
      const allCollections = dtestData.dCollections(6);

      const { container } = renderWithReactQuery(
         <AddToCollectionDialog
            prompt={prompt}
            collections={allCollections}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertEntityCollectionIdsLoadingRendered();
         assertSaveBtnDisabled();
      });

      expect(container).toMatchSnapshot();
   });

   it("open true - empty library collections - test", async () => {
      const mutationResult = updateMutationResultMock();
      const queryResult = queryResultMock();

      useUpdatePromptCollectionsMock.mockReturnValue(mutationResult);
      useLoadPromptCollectionIdsMock.mockReturnValue(queryResult);

      const prompt = dtestData.dPrompt();

      const { container } = renderWithReactQuery(
         <AddToCollectionDialog
            prompt={prompt}
            collections={[]}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertCollectionsEmptyRendered();
         assertEntryCollectionIdsLoaded(prompt.id, true);
      });

      expect(container).toMatchSnapshot();
   });

   it("isSaving true - save button disabled - test", async () => {
      const mutationResult = mutationObserverLoadingResultMock();
      const queryResult = queryResultMock([]);

      useUpdatePromptCollectionsMock.mockReturnValue(mutationResult);
      useLoadPromptCollectionIdsMock.mockReturnValue(queryResult);

      const prompt = dtestData.dPrompt();
      const allCollections = dtestData.dCollections(6);

      const { container } = renderWithReactQuery(
         <AddToCollectionDialog
            prompt={prompt}
            collections={allCollections}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertSaveBtnDisabled();
      });

      expect(container).toMatchSnapshot();
   });

   it("open false - test", async () => {
      const mutationResult = updateMutationResultMock();
      const queryResult = queryResultMock();

      useUpdatePromptCollectionsMock.mockReturnValue(mutationResult);
      useLoadPromptCollectionIdsMock.mockReturnValue(queryResult);

      const prompt = dtestData.dPrompt();
      const allCollections = dtestData.dCollections(6);

      const { container } = renderWithReactQuery(
         <AddToCollectionDialog
            prompt={prompt}
            collections={allCollections}
            open={false}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertDialogNotRendered();
         assertEntryCollectionIdsLoaded(prompt.id, false);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("AddToCollectionDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();

      const mutationResult = createMutationResultMock();
      useCreateCollectionMock.mockReturnValue(mutationResult);
   });

   it("save btn clicked - success true - test", async () => {
      const actionResult: ActionResult = {
         success: true,
         message: "Sammlungen aktualisiert",
      };

      const allCollections = dtestData.dCollections(3);
      const collection1 = allCollections[0];
      const collection2 = allCollections[1];
      const collection3 = allCollections[2];
      const selectedIds = [collection1.id, collection2.id];

      const onOpenChange = jest.fn();
      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
      });

      const mutationResult = updateMutationResultMock(mutateFn);
      const queryResult = queryResultMock(selectedIds);

      useUpdatePromptCollectionsMock.mockReturnValue(mutationResult);
      useLoadPromptCollectionIdsMock.mockReturnValue(queryResult);

      const prompt = dtestData.dPrompt();

      renderWithReactQuery(
         <AddToCollectionDialog
            prompt={prompt}
            collections={allCollections}
            open={true}
            onOpenChange={onOpenChange}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(mutateFn).not.toHaveBeenCalled();
      });

      const checkBox1 = screen.getByTestId(`collection-${collection1.id}`);
      await userEvent.click(checkBox1);

      const checkBox2 = screen.getByTestId(`collection-${collection3.id}`);
      await userEvent.click(checkBox2);

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      const expectedParams: UpdateCollectionIdsParams = {
         entryId: dtestData.dPrompt().id,
         collectionIds: [collection2.id, collection3.id],
      };

      const expectedCallback = expect.objectContaining({
         onSuccess: expect.any(Function),
         onError: expect.any(Function),
      });

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(mutateFn).toHaveBeenCalledWith(
            expectedParams,
            expectedCallback
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(actionResult.message);
         expect(onOpenChange).toHaveBeenCalledTimes(1);
         expect(onOpenChange).toHaveBeenCalledWith(false);
      });
   });

   it("save btn clicked - success false - test", async () => {
      const actionResult: ActionResult = {
         success: false,
         message: "Fehler beim Speichern",
      };

      const allCollections = dtestData.dCollections(3);
      const collection1 = allCollections[0];
      const collection2 = allCollections[1];
      const collection3 = allCollections[2];
      const selectedIds = [collection1.id];

      const onOpenChange = jest.fn();
      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
      });

      const mutationResult = updateMutationResultMock(mutateFn);
      const queryResult = queryResultMock(selectedIds);

      useUpdatePromptCollectionsMock.mockReturnValue(mutationResult);
      useLoadPromptCollectionIdsMock.mockReturnValue(queryResult);

      const prompt = dtestData.dPrompt();

      renderWithReactQuery(
         <AddToCollectionDialog
            prompt={prompt}
            collections={allCollections}
            open={true}
            onOpenChange={onOpenChange}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(mutateFn).not.toHaveBeenCalled();
      });

      const checkBox1 = screen.getByTestId(`collection-${collection2.id}`);
      await userEvent.click(checkBox1);

      const checkBox2 = screen.getByTestId(`collection-${collection3.id}`);
      await userEvent.click(checkBox2);

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      const expectedParams: UpdateCollectionIdsParams = {
         entryId: prompt.id,
         collectionIds: [collection1.id, collection2.id, collection3.id],
      };

      const expectedCallback = expect.objectContaining({
         onSuccess: expect.any(Function),
         onError: expect.any(Function),
      });

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(mutateFn).toHaveBeenCalledWith(
            expectedParams,
            expectedCallback
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(actionResult.message);
         expect(onOpenChange).not.toHaveBeenCalled();
      });
   });

   it("save btn clicked - onError - test", async () => {
      const allCollections = dtestData.dCollections(3);
      const collection1 = allCollections[0];
      const selectedIds = [collection1.id];

      const onOpenChange = jest.fn();
      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onError();
      });

      const mutationResult = updateMutationResultMock(mutateFn);
      const queryResult = queryResultMock(selectedIds);

      useUpdatePromptCollectionsMock.mockReturnValue(mutationResult);
      useLoadPromptCollectionIdsMock.mockReturnValue(queryResult);

      const prompt = dtestData.dPrompt();

      renderWithReactQuery(
         <AddToCollectionDialog
            prompt={prompt}
            collections={allCollections}
            open={true}
            onOpenChange={onOpenChange}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      const expectedParams: UpdateCollectionIdsParams = {
         entryId: prompt.id,
         collectionIds: selectedIds,
      };

      const expectedCallback = expect.objectContaining({
         onSuccess: expect.any(Function),
         onError: expect.any(Function),
      });

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(mutateFn).toHaveBeenCalledWith(
            expectedParams,
            expectedCallback
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(
            "Fehler beim Aktualisieren der Sammlungen"
         );
         expect(onOpenChange).not.toHaveBeenCalled();
      });
   });

   it("create first collection btn clicked - test", async () => {
      const mutationResult = updateMutationResultMock();
      const queryResult = queryResultMock();

      useUpdatePromptCollectionsMock.mockReturnValue(mutationResult);
      useLoadPromptCollectionIdsMock.mockReturnValue(queryResult);

      const prompt = dtestData.dPrompt();

      renderWithReactQuery(
         <AddToCollectionDialog
            prompt={prompt}
            collections={[]}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertCreateCollectionDialogNotRendered();
      });

      const createBtn = screen.getByTestId("create-first-collection-btn");
      await userEvent.click(createBtn);

      await waitFor(() => {
         assertCreateCollectionDialogRendered();
      });
   });

   it("create new collection btn clicked - test", async () => {
      const mutationResult = updateMutationResultMock();
      const queryResult = queryResultMock();

      useUpdatePromptCollectionsMock.mockReturnValue(mutationResult);
      useLoadPromptCollectionIdsMock.mockReturnValue(queryResult);

      const prompt = dtestData.dPrompt();
      const allCollections = dtestData.dCollections(3);
      allCollections[0].color = null;

      renderWithReactQuery(
         <AddToCollectionDialog
            prompt={prompt}
            collections={allCollections}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertCreateCollectionDialogNotRendered();
      });

      const createBtn = screen.getByTestId("create-new-collection-btn");
      await userEvent.click(createBtn);

      await waitFor(() => {
         assertCreateCollectionDialogRendered();
      });
   });
});
