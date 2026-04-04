jest.mock("@/data/ts-queries/library");
jest.mock("sonner");

import { screen, waitFor, within } from "@testing-library/react";
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

import { useCreateCollection } from "@/data/ts-queries/library";
import {
   DLibraryCollection,
   DLibraryCollectionUpdate,
} from "@/data/types/domain/collection";
import { ActionResult } from "@/data/types/utils";

import { LibraryCollectionCreateDialog } from "./create-library-collection-dialog";

type UseCreateCollectionResult = ReturnType<typeof useCreateCollection>;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const useCreateCollectionMock = useCreateCollection as jest.MockedFunction<
   typeof useCreateCollection
>;

const mutationResultMock = (
   mutateFn = jest.fn()
): UseCreateCollectionResult => {
   const result = ctestData.useMutationResultMock(mutateFn);
   return result as UseCreateCollectionResult;
};

const mutationObserverLoadingResultMock = (): UseCreateCollectionResult => {
   const result = ctestData.useMutationObserverLoadingResult();
   return result as unknown as UseCreateCollectionResult;
};

const assertDialogRendered = () => {
   const dialog = screen.getByTestId("create-library-collection-dialog");
   const submitBtn = screen.getByTestId("submit-btn");
   const cancelBtn = screen.getByTestId("cancel-btn");

   assertInDocument(submitBtn);
   assertInDocument(cancelBtn);
   assertInDocument(dialog);
};

const assertDialogNotRendered = () => {
   const dialog = screen.queryByTestId("create-library-collection-dialog");
   assertNotInDocument(dialog);
};

const assertFieldsRendered = () => {
   const name = screen.getByTestId("name");
   const description = screen.getByTestId("description");
   const color = screen.getByTestId("color");

   assertInDocument(name);
   assertInDocument(description);
   assertInDocument(color);
};

describe("LibraryCollectionCreateDialog rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("LibraryCollectionCreateDialog - open true - renders dialog - test", async () => {
      const result = mutationResultMock();
      useCreateCollectionMock.mockReturnValue(result);

      const { container } = renderWithReactQuery(
         <LibraryCollectionCreateDialog open={true} onOpenChange={jest.fn()} />
      );

      await waitFor(() => {
         assertDialogRendered();
         assertFieldsRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryCollectionCreateDialog - open false - does not render dialog - test", async () => {
      const result = mutationResultMock();
      useCreateCollectionMock.mockReturnValue(result);

      const { container } = renderWithReactQuery(
         <LibraryCollectionCreateDialog open={false} onOpenChange={jest.fn()} />
      );

      await waitFor(() => {
         assertDialogNotRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("LibraryCollectionCreateDialog - isPending true - test", async () => {
      const result = mutationObserverLoadingResultMock();
      useCreateCollectionMock.mockReturnValue(result);

      renderWithReactQuery(
         <LibraryCollectionCreateDialog open={true} onOpenChange={jest.fn()} />
      );

      await waitFor(() => {
         const submitBtn = screen.getByTestId("submit-btn");
         assertHasAttributeWithValue(submitBtn, "disabled", "");
      });
   });
});

describe("LibraryCollectionCreateDialog functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("LibraryCollectionCreateDialog - submit btn clicked - success true - test", async () => {
      const actionResult: ActionResult<DLibraryCollection> = {
         success: true,
         message: "Collection Created",
         data: dtestData.dLibraryCollection(),
      };

      const onOpenChange = jest.fn();
      const mutateFn = jest.fn((_data: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
      });

      const result = mutationResultMock(mutateFn);
      useCreateCollectionMock.mockReturnValue(result);

      renderWithReactQuery(
         <LibraryCollectionCreateDialog
            open={true}
            onOpenChange={onOpenChange}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(mutateFn).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(mutateFn).not.toHaveBeenCalled();
      });

      const nameValue = "Collection 1";
      const name = screen.getByTestId("name");
      const nameInput = within(name).getByTestId("input");
      await userEvent.type(nameInput, nameValue);

      await userEvent.click(submitBtn);

      const expectedPayload: DLibraryCollectionUpdate = {
         name: nameValue,
         description: "",
         color: "#3b82f6",
      };

      const expectedCallback = expect.objectContaining({
         onSuccess: expect.any(Function),
         onError: expect.any(Function),
      });

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(mutateFn).toHaveBeenCalledWith(
            expectedPayload,
            expectedCallback
         );
         expect(toastMock.success).toHaveBeenCalledTimes(1);
         expect(toastMock.success).toHaveBeenCalledWith(actionResult.message);
         expect(onOpenChange).toHaveBeenCalledTimes(1);
         expect(onOpenChange).toHaveBeenCalledWith(false);
      });
   });

   it("LibraryCollectionCreateDialog - submit btn clicked - success false - test", async () => {
      const actionResult: ActionResult = {
         success: false,
         message: "Fehler beim Erstellen",
      };

      const onOpenChange = jest.fn();
      const mutateFn = jest.fn((_data: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
      });

      const result = mutationResultMock(mutateFn);
      useCreateCollectionMock.mockReturnValue(result);

      renderWithReactQuery(
         <LibraryCollectionCreateDialog
            open={true}
            onOpenChange={onOpenChange}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(mutateFn).not.toHaveBeenCalled();
      });

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(mutateFn).not.toHaveBeenCalled();
      });

      const nameValue = "Collection 123";
      const name = screen.getByTestId("name");
      const nameInput = within(name).getByTestId("input");
      await userEvent.type(nameInput, nameValue);

      await userEvent.click(submitBtn);

      const expectedPayload: DLibraryCollectionUpdate = {
         name: nameValue,
         description: "",
         color: "#3b82f6",
      };

      const expectedCallback = expect.objectContaining({
         onSuccess: expect.any(Function),
         onError: expect.any(Function),
      });

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(mutateFn).toHaveBeenCalledWith(
            expectedPayload,
            expectedCallback
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(actionResult.message);
         expect(onOpenChange).not.toHaveBeenCalled();
      });
   });

   it("LibraryCollectionCreateDialog - submit btn clicked - error - test", async () => {
      const onOpenChange = jest.fn();
      const mutateFn = jest.fn((_data: unknown, callbacks) => {
         callbacks.onError();
      });

      const result = mutationResultMock(mutateFn);
      useCreateCollectionMock.mockReturnValue(result);

      renderWithReactQuery(
         <LibraryCollectionCreateDialog
            open={true}
            onOpenChange={onOpenChange}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
         expect(mutateFn).not.toHaveBeenCalled();
      });

      const nameValue = "Collection 789";
      const name = screen.getByTestId("name");
      const nameInput = within(name).getByTestId("input");
      await userEvent.type(nameInput, nameValue);

      const submitBtn = screen.getByTestId("submit-btn");
      await userEvent.click(submitBtn);

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(
            "Fehler beim Erstellen der Sammlung"
         );
         expect(onOpenChange).not.toHaveBeenCalled();
      });
   });

   it("LibraryCollectionCreateDialog - cancel button closes dialog - test", async () => {
      const onOpenChange = jest.fn();
      const result = mutationResultMock();
      useCreateCollectionMock.mockReturnValue(result);

      renderWithReactQuery(
         <LibraryCollectionCreateDialog
            open={true}
            onOpenChange={onOpenChange}
         />
      );

      await waitFor(() => {
         assertDialogRendered();
      });

      const cancelBtn = screen.getByTestId("cancel-btn");
      await userEvent.click(cancelBtn);

      await waitFor(() => {
         expect(onOpenChange).toHaveBeenCalledTimes(1);
         expect(onOpenChange).toHaveBeenCalledWith(false);
      });
   });
});
