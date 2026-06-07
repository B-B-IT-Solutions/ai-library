jest.mock("@/data/ts-queries/collection");
jest.mock("@/data/ts-queries/prompt");
jest.mock("sonner");

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
   assertInDocument,
   assertNotInDocument,
   ctestData,
   dtestData,
   renderWithReactQuery,
} from "@tests";
import { toast } from "sonner";

import {
   AddPromptToCollectionParams,
   useAddPromptToCollection,
   useLoadCollectionPromptIds,
   useRemovePromptFromCollection,
} from "@/data/ts-queries/collection";
import {
   type LoadTemplateDescriptorsParams,
   useInfiniteLoadTemplateDescriptors,
} from "@/data/ts-queries/prompt";
import { DPromptsPage } from "@/data/types/domain/prompt";
import { ActionResult } from "@/data/types/utils";

import { CollectionPrompts } from "./collection-prompts";

type UseAddPromptResult = ReturnType<typeof useAddPromptToCollection>;
type UseRemovePromptResult = ReturnType<typeof useRemovePromptFromCollection>;
type UseLoadPromptIdsResult = ReturnType<typeof useLoadCollectionPromptIds>;
type UseInfinitePromptsResult = ReturnType<
   typeof useInfiniteLoadTemplateDescriptors
>;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const useAddPromptToCollectionMock =
   useAddPromptToCollection as jest.MockedFunction<
      typeof useAddPromptToCollection
   >;
const useRemovePromptFromCollectionMock =
   useRemovePromptFromCollection as jest.MockedFunction<
      typeof useRemovePromptFromCollection
   >;
const useLoadCollectionPromptIdsMock =
   useLoadCollectionPromptIds as jest.MockedFunction<
      typeof useLoadCollectionPromptIds
   >;
const useInfiniteLoadTemplateDescriptorsMock =
   useInfiniteLoadTemplateDescriptors as jest.MockedFunction<
      typeof useInfiniteLoadTemplateDescriptors
   >;

const addMutationResultMock = (mutateFn = jest.fn()): UseAddPromptResult => {
   return ctestData.useMutationResultMock(mutateFn) as UseAddPromptResult;
};

const removeMutationResultMock = (
   mutateFn = jest.fn()
): UseRemovePromptResult => {
   return ctestData.useMutationResultMock(mutateFn) as UseRemovePromptResult;
};

const promptIdsQueryResultMock = (
   data: string[] | undefined,
   isLoading = false
): UseLoadPromptIdsResult => {
   return { data, isLoading } as UseLoadPromptIdsResult;
};

const infiniteQueryResultMock = (
   pages: DPromptsPage[] = [],
   hasNextPage = false,
   isFetching = false
): UseInfinitePromptsResult => {
   return {
      data: { pages, pageParams: [] },
      fetchNextPage: jest.fn(),
      hasNextPage,
      isFetching,
   } as unknown as UseInfinitePromptsResult;
};

const collectionId = "collection-1";

const setupDefaultMocks = () => {
   useAddPromptToCollectionMock.mockReturnValue(addMutationResultMock());
   useRemovePromptFromCollectionMock.mockReturnValue(
      removeMutationResultMock()
   );
   useLoadCollectionPromptIdsMock.mockReturnValue(promptIdsQueryResultMock([]));
   useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
      infiniteQueryResultMock()
   );
};

const assertRendered = () => {
   const collectionTemplates = screen.getByTestId("collection-prompts");
   const search = screen.getByTestId("templates-search");

   assertInDocument(collectionTemplates);
   assertInDocument(search);
};

const assertTemplatesLoadingRendered = () => {
   const loading = screen.getByTestId("templates-loading");
   const list = screen.queryByTestId("templates-list");

   assertInDocument(loading);
   assertNotInDocument(list);
};

const assertTemplatesListRendered = () => {
   const list = screen.getByTestId("templates-list");
   const loading = screen.queryByTestId("templates-loading");

   assertInDocument(list);
   assertNotInDocument(loading);
};

const assertInCollecitonEmpty = () => {
   const empty = screen.getByTestId("in-collection-empty");
   assertInDocument(empty);
};

const assertNotInCollecitonEmpty = () => {
   const empty = screen.getByTestId("not-in-collection-empty");
   assertInDocument(empty);
};

const assertTemplateRows = (count: number, isIn: boolean) => {
   const rows = screen.getAllByTestId(`template-row-${isIn}`);
   expect(rows).toHaveLength(count);
};

const assertLoaderIcon = () => {
   const icon = screen.getByTestId("loader-icon");
   assertInDocument(icon);
};

describe("CollectionPrompts rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      setupDefaultMocks();
   });

   it("idsLoading true - test", async () => {
      const promptIdsQueryResult = promptIdsQueryResultMock(undefined, true);
      useLoadCollectionPromptIdsMock.mockReturnValue(promptIdsQueryResult);

      const { container } = renderWithReactQuery(
         <CollectionPrompts collectionId={collectionId} />
      );

      await waitFor(() => {
         assertRendered();
         assertTemplatesLoadingRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("in collection/not in collection - empty - test", async () => {
      const promptIdsQueryResult = promptIdsQueryResultMock([]);
      useLoadCollectionPromptIdsMock.mockReturnValue(promptIdsQueryResult);

      const page = dtestData.dPromptsPage(0);
      const loadPromptsQueryResult = infiniteQueryResultMock([page]);
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         loadPromptsQueryResult
      );

      const { container } = renderWithReactQuery(
         <CollectionPrompts collectionId={collectionId} />
      );

      await waitFor(() => {
         assertRendered();
         assertTemplatesListRendered();
         assertInCollecitonEmpty();
         assertNotInCollecitonEmpty();
      });

      expect(container).toMatchSnapshot();
   });

   it("in collection/not in collection - with items - test", async () => {
      const page = dtestData.dPromptsPage(6);
      const promptIds = [page.content[0].id];

      const promptIdsQueryResult = promptIdsQueryResultMock(promptIds);
      useLoadCollectionPromptIdsMock.mockReturnValue(promptIdsQueryResult);

      const loadPromptsQueryResult = infiniteQueryResultMock([page]);
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         loadPromptsQueryResult
      );

      const { container } = renderWithReactQuery(
         <CollectionPrompts collectionId={collectionId} />
      );

      await waitFor(() => {
         assertRendered();
         assertTemplatesListRendered();
         assertTemplateRows(1, true);
         assertTemplateRows(5, false);
      });

      expect(container).toMatchSnapshot();
   });
});

describe("CollectionPrompts functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      setupDefaultMocks();
   });

   it("add template - success true - test", async () => {
      const actionResult: ActionResult = {
         success: true,
         message: "Hinzugefügt",
      };

      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
      });

      const promptIdsQueryResult = promptIdsQueryResultMock([]);
      useLoadCollectionPromptIdsMock.mockReturnValue(promptIdsQueryResult);

      const page = dtestData.dPromptsPage(2);
      const loadPromptsQueryResult = infiniteQueryResultMock([page]);
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         loadPromptsQueryResult
      );

      const addResultMock = addMutationResultMock(mutateFn);
      useAddPromptToCollectionMock.mockReturnValue(addResultMock);

      renderWithReactQuery(<CollectionPrompts collectionId={collectionId} />);

      await waitFor(() => {
         assertRendered();
         assertTemplatesListRendered();
         assertTemplateRows(2, false);
      });

      const addBtn = screen.getAllByTestId("add-template-btn");
      await userEvent.click(addBtn[0]);

      await waitFor(() => {
         assertLoaderIcon();
      });

      const expectedParams: AddPromptToCollectionParams = {
         collectionId,
         promptId: page.content[0].id,
      };

      const expectedCallback = expect.objectContaining({
         onSuccess: expect.any(Function),
         onSettled: expect.any(Function),
      });

      const expectedLoadDescriptorsParams: LoadTemplateDescriptorsParams = {
         filters: { search: undefined },
      };

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(mutateFn).toHaveBeenCalledWith(
            expectedParams,
            expectedCallback
         );
         expect(toastMock.error).not.toHaveBeenCalled();
         expect(useInfiniteLoadTemplateDescriptorsMock).toHaveBeenCalledWith(
            expectedLoadDescriptorsParams
         );
         expect(useLoadCollectionPromptIdsMock).toHaveBeenCalledWith(
            collectionId
         );
      });
   });

   it("add template - success false - test", async () => {
      const actionResult: ActionResult = {
         success: false,
         message: "Fehler beim Hinzufügen",
      };
      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
         callbacks.onSettled();
      });

      const promptIdsQueryResult = promptIdsQueryResultMock([]);
      useLoadCollectionPromptIdsMock.mockReturnValue(promptIdsQueryResult);

      const page = dtestData.dPromptsPage(3);
      const loadPromptsQueryResult = infiniteQueryResultMock([page]);
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         loadPromptsQueryResult
      );

      const addResultMock = addMutationResultMock(mutateFn);
      useAddPromptToCollectionMock.mockReturnValue(addResultMock);

      renderWithReactQuery(<CollectionPrompts collectionId={collectionId} />);

      await waitFor(() => {
         assertRendered();
         assertTemplatesListRendered();
         assertTemplateRows(3, false);
      });

      const addBtn = screen.getAllByTestId("add-template-btn");
      await userEvent.click(addBtn[0]);

      const expectedParams: AddPromptToCollectionParams = {
         collectionId,
         promptId: page.content[0].id,
      };

      const expectedCallback = expect.objectContaining({
         onSuccess: expect.any(Function),
         onSettled: expect.any(Function),
      });

      const expectedLoadDescriptorsParams: LoadTemplateDescriptorsParams = {
         filters: { search: undefined },
      };

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(mutateFn).toHaveBeenCalledWith(
            expectedParams,
            expectedCallback
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(actionResult.message);
         expect(useInfiniteLoadTemplateDescriptorsMock).toHaveBeenCalledWith(
            expectedLoadDescriptorsParams
         );
         expect(useLoadCollectionPromptIdsMock).toHaveBeenCalledWith(
            collectionId
         );
      });
   });

   it("remove template - success true - test", async () => {
      const actionResult: ActionResult = {
         success: true,
         message: "Entfernt",
      };

      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
         callbacks.onSettled();
      });

      const page = dtestData.dPromptsPage(6);
      const promptIds = [page.content[0].id];

      const promptIdsQueryResult = promptIdsQueryResultMock(promptIds);
      useLoadCollectionPromptIdsMock.mockReturnValue(promptIdsQueryResult);

      const loadPromptsQueryResult = infiniteQueryResultMock([page]);
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         loadPromptsQueryResult
      );

      const removeResultMock = removeMutationResultMock(mutateFn);
      useRemovePromptFromCollectionMock.mockReturnValue(removeResultMock);

      renderWithReactQuery(<CollectionPrompts collectionId={collectionId} />);

      const removeBtn = screen.getAllByTestId("remove-template-btn");
      await userEvent.click(removeBtn[0]);

      const expectedParams: AddPromptToCollectionParams = {
         collectionId,
         promptId: page.content[0].id,
      };

      const expectedCallback = expect.objectContaining({
         onSuccess: expect.any(Function),
         onSettled: expect.any(Function),
      });

      const expectedLoadDescriptorsParams: LoadTemplateDescriptorsParams = {
         filters: { search: undefined },
      };

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(mutateFn).toHaveBeenCalledWith(
            expectedParams,
            expectedCallback
         );
         expect(toastMock.error).not.toHaveBeenCalled();
         expect(useInfiniteLoadTemplateDescriptorsMock).toHaveBeenCalledWith(
            expectedLoadDescriptorsParams
         );
         expect(useLoadCollectionPromptIdsMock).toHaveBeenCalledWith(
            collectionId
         );
      });
   });

   it("remove template - success false - test", async () => {
      const actionResult: ActionResult = {
         success: false,
         message: "Fehler beim Entfernen",
      };

      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
         callbacks.onSettled();
      });

      const page = dtestData.dPromptsPage(1);
      const promptIds = [page.content[0].id];

      const promptIdsQueryResult = promptIdsQueryResultMock(promptIds);
      useLoadCollectionPromptIdsMock.mockReturnValue(promptIdsQueryResult);

      const loadPromptsQueryResult = infiniteQueryResultMock([page]);
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         loadPromptsQueryResult
      );

      const removeResultMock = removeMutationResultMock(mutateFn);
      useRemovePromptFromCollectionMock.mockReturnValue(removeResultMock);

      renderWithReactQuery(<CollectionPrompts collectionId={collectionId} />);

      const removeBtn = screen.getAllByTestId("remove-template-btn");
      await userEvent.click(removeBtn[0]);

      const expectedParams: AddPromptToCollectionParams = {
         collectionId,
         promptId: page.content[0].id,
      };

      const expectedCallback = expect.objectContaining({
         onSuccess: expect.any(Function),
         onSettled: expect.any(Function),
      });

      const expectedLoadDescriptorsParams: LoadTemplateDescriptorsParams = {
         filters: { search: undefined },
      };

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(mutateFn).toHaveBeenCalledWith(
            expectedParams,
            expectedCallback
         );
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(actionResult.message);
         expect(useInfiniteLoadTemplateDescriptorsMock).toHaveBeenCalledWith(
            expectedLoadDescriptorsParams
         );
         expect(useLoadCollectionPromptIdsMock).toHaveBeenCalledWith(
            collectionId
         );
      });
   });

   it("search input test", async () => {
      renderWithReactQuery(<CollectionPrompts collectionId={collectionId} />);

      const value = "test 1";
      const input = screen.getByTestId("search-input");
      await userEvent.type(input, value);

      const expectedLoadDescriptorsParams: LoadTemplateDescriptorsParams = {
         filters: { search: value },
      };

      await waitFor(() => {
         expect(useInfiniteLoadTemplateDescriptorsMock).toHaveBeenCalledWith(
            expectedLoadDescriptorsParams
         );
      });
   });
});
