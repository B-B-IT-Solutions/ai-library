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
   useLoadEntryCollectionIds,
   useUpdateEntryCollections,
} from "@/data/ts-queries/library";
import { UpdateCollectionIdsParams } from "@/data/ts-queries/library/types";
import { DLibraryCollection } from "@/data/types/domain/library";
import { ActionResult } from "@/data/types/utils";

import { AddToLibraryCollectionDialog } from "./add-to-library-collection-dialog";

type UseUpdateEntryCollectionsResult = ReturnType<
   typeof useUpdateEntryCollections
>;
type UseLoadEntryCollectionIdsResult = ReturnType<
   typeof useLoadEntryCollectionIds
>;

const toastMock = toast as jest.MockedFunction<typeof toast>;
const useUpdateEntryCollectionsMock =
   useUpdateEntryCollections as jest.MockedFunction<
      typeof useUpdateEntryCollections
   >;
const useLoadEntryCollectionIdsMock =
   useLoadEntryCollectionIds as jest.MockedFunction<
      typeof useLoadEntryCollectionIds
   >;
const useCreateCollectionMock = useCreateCollection as jest.MockedFunction<
   typeof useCreateCollection
>;

const mutationResultMock = (
   mutateFn = jest.fn()
): UseUpdateEntryCollectionsResult => {
   const result = ctestData.useMutationResultMock(mutateFn);
   return result as UseUpdateEntryCollectionsResult;
};

const mutationObserverLoadingResultMock =
   (): UseUpdateEntryCollectionsResult => {
      const result = ctestData.useMutationObserverLoadingResult();
      return result as unknown as UseUpdateEntryCollectionsResult;
   };

const queryResultMock = (
   data: string[] | undefined = undefined,
   isLoading = false
): UseLoadEntryCollectionIdsResult => {
   return { data, isLoading } as UseLoadEntryCollectionIdsResult;
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("add-to-collection-dialog");
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("add-to-collection-dialog");
   assertNotInDocument(dialog);
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

const renderDialog = (
   open: boolean,
   onOpenChange = jest.fn(),
   collections: DLibraryCollection[] = dtestData.dLibraryCollections(3),
   mutateFn = jest.fn(),
   collectionIdsData: string[] | undefined = [],
   isLoading = false
) => {
   const mutationHookResult = mutationResultMock(mutateFn);
   useUpdateEntryCollectionsMock.mockReturnValue(mutationHookResult);

   useLoadEntryCollectionIdsMock.mockReturnValue(
      queryResultMock(collectionIdsData, isLoading)
   );

   const entry = dtestData.dLibraryEntry();
   return renderWithReactQuery(
      <AddToLibraryCollectionDialog
         entry={entry}
         collections={collections}
         open={open}
         onOpenChange={onOpenChange}
      />
   );
};

describe("AddToLibraryCollectionDialog rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      useCreateCollectionMock.mockReturnValue(
         ctestData.useMutationResultMock() as ReturnType<
            typeof useCreateCollection
         >
      );
   });

   it("AddToLibraryCollectionDialog - open true - test", async () => {
      const mutationResult = mutationResultMock();
      const queryResult = queryResultMock();

      useUpdateEntryCollectionsMock.mockReturnValue(mutationResult);
      useLoadEntryCollectionIdsMock.mockReturnValue(queryResult);

      const entry = dtestData.dLibraryEntry();
      const allCollections = dtestData.dLibraryCollections(6);

      const { container } = renderWithReactQuery(
         <AddToLibraryCollectionDialog
            entry={entry}
            collections={allCollections}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("AddToLibraryCollectionDialog - open true - isLoading true - test", async () => {
      const entryCollectionIds = dtestData.dLibraryCollectionIds(3);
      const mutationResult = mutationResultMock();
      const queryResult = queryResultMock(entryCollectionIds, true);

      useUpdateEntryCollectionsMock.mockReturnValue(mutationResult);
      useLoadEntryCollectionIdsMock.mockReturnValue(queryResult);

      const entry = dtestData.dLibraryEntry();
      const allCollections = dtestData.dLibraryCollections(6);

      const { container } = renderWithReactQuery(
         <AddToLibraryCollectionDialog
            entry={entry}
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

   it("AddToLibraryCollectionDialog - open true - empty library collections - test", async () => {
      const mutationResult = mutationResultMock();
      const queryResult = queryResultMock();

      useUpdateEntryCollectionsMock.mockReturnValue(mutationResult);
      useLoadEntryCollectionIdsMock.mockReturnValue(queryResult);

      const entry = dtestData.dLibraryEntry();

      const { container } = renderWithReactQuery(
         <AddToLibraryCollectionDialog
            entry={entry}
            collections={[]}
            open={true}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertCollectionsEmptyRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("AddToLibraryCollectionDialog - isSaving true - save button disabled - test", async () => {
      const mutationResult = mutationObserverLoadingResultMock();
      const queryResult = queryResultMock([]);

      useUpdateEntryCollectionsMock.mockReturnValue(mutationResult);
      useLoadEntryCollectionIdsMock.mockReturnValue(queryResult);

      const entry = dtestData.dLibraryEntry();
      const allCollections = dtestData.dLibraryCollections(6);

      const { container } = renderWithReactQuery(
         <AddToLibraryCollectionDialog
            entry={entry}
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

   it("AddToLibraryCollectionDialog - open false - test", async () => {
      const mutationResult = mutationResultMock();
      const queryResult = queryResultMock();

      useUpdateEntryCollectionsMock.mockReturnValue(mutationResult);
      useLoadEntryCollectionIdsMock.mockReturnValue(queryResult);

      const entry = dtestData.dLibraryEntry();
      const allCollections = dtestData.dLibraryCollections(6);

      const { container } = renderWithReactQuery(
         <AddToLibraryCollectionDialog
            entry={entry}
            collections={allCollections}
            open={false}
            onOpenChange={jest.fn()}
         />
      );

      await waitFor(() => {
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });
});

describe("AddToLibraryCollectionDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      useCreateCollectionMock.mockReturnValue(
         ctestData.useMutationResultMock() as ReturnType<
            typeof useCreateCollection
         >
      );
   });

   it("AddToLibraryCollectionDialog - checkbox toggle - selects collection - test", async () => {
      const collections = dtestData.dLibraryCollections(3);
      renderDialog(true, jest.fn(), collections, jest.fn(), []);

      await waitFor(() => {
         const checkboxes = screen.getAllByRole("checkbox");
         expect(checkboxes[0]).toHaveAttribute("data-state", "unchecked");
      });

      const checkboxes = screen.getAllByRole("checkbox");
      await userEvent.click(checkboxes[0]);

      await waitFor(() => {
         expect(screen.getAllByRole("checkbox")[0]).toHaveAttribute(
            "data-state",
            "checked"
         );
      });
   });

   it("AddToLibraryCollectionDialog - checkbox toggle - deselects collection - test", async () => {
      const collections = dtestData.dLibraryCollections(3);
      const selectedIds = [collections[0].id];
      renderDialog(true, jest.fn(), collections, jest.fn(), selectedIds);

      await waitFor(() => {
         expect(screen.getAllByRole("checkbox")[0]).toHaveAttribute(
            "data-state",
            "checked"
         );
      });

      const checkboxes = screen.getAllByRole("checkbox");
      await userEvent.click(checkboxes[0]);

      await waitFor(() => {
         expect(screen.getAllByRole("checkbox")[0]).toHaveAttribute(
            "data-state",
            "unchecked"
         );
      });
   });

   it("AddToLibraryCollectionDialog - save btn clicked - success true - test", async () => {
      const actionResult: ActionResult = {
         success: true,
         message: "Sammlungen aktualisiert",
      };

      const onOpenChange = jest.fn();
      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
      });

      const collections = dtestData.dLibraryCollections(3);
      const selectedIds = [collections[0].id, collections[1].id];
      renderDialog(true, onOpenChange, collections, mutateFn, selectedIds);

      await waitFor(() => {
         assertDialogRendered();
         expect(mutateFn).not.toHaveBeenCalled();
      });

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      const expectedParams: UpdateCollectionIdsParams = {
         entryId: dtestData.dLibraryEntry().id,
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
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(actionResult.message);
         expect(onOpenChange).toHaveBeenCalledTimes(1);
         expect(onOpenChange).toHaveBeenCalledWith(false);
      });
   });

   it("AddToLibraryCollectionDialog - save btn clicked - success false - test", async () => {
      const actionResult: ActionResult = {
         success: false,
         message: "Fehler beim Speichern",
      };

      const onOpenChange = jest.fn();
      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
      });

      renderDialog(
         true,
         onOpenChange,
         dtestData.dLibraryCollections(3),
         mutateFn,
         []
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(actionResult.message);
         expect(onOpenChange).not.toHaveBeenCalled();
      });
   });

   it("AddToLibraryCollectionDialog - save btn clicked - onError - test", async () => {
      const onOpenChange = jest.fn();
      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onError();
      });

      renderDialog(
         true,
         onOpenChange,
         dtestData.dLibraryCollections(3),
         mutateFn,
         []
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      const saveBtn = screen.getByTestId("save-btn");
      await userEvent.click(saveBtn);

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(
            "Fehler beim Aktualisieren der Sammlungen"
         );
         expect(onOpenChange).not.toHaveBeenCalled();
      });
   });

   it("AddToLibraryCollectionDialog - create new collection btn - shows create dialog - test", async () => {
      renderDialog(true);

      await waitFor(() => {
         assertDialogRendered();
      });

      const createBtn = screen.getByTestId("create-new-collection-btn");
      await userEvent.click(createBtn);

      await waitFor(() => {
         const createDialog = screen.getByTestId(
            "create-library-collection-dialog"
         );
         assertInDocument(createDialog);
      });
   });
});
