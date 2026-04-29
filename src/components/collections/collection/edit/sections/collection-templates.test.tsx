jest.mock("@/data/ts-queries/collection");
jest.mock("@/data/ts-queries/library");
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
   AddTemplateToCollectionParams,
   useAddTemplateToCollection,
   useLoadCollectionTemplateIds,
   useRemoveTemplateFromCollection,
} from "@/data/ts-queries/collection";
import { useInfiniteLoadTemplateDescriptors } from "@/data/ts-queries/template";
import { LoadTemplateDescriptorsParams } from "@/data/ts-queries/template/types";
import { DTemplateDescriptorsPage } from "@/data/types/domain/prompt.template";
import { ActionResult } from "@/data/types/utils";

import { CollectionTemplates } from "./collection-templates";

type UseAddTemplateResult = ReturnType<typeof useAddTemplateToCollection>;
type UseRemoveTemplateResult = ReturnType<
   typeof useRemoveTemplateFromCollection
>;
type UseLoadTemplateIdsResult = ReturnType<typeof useLoadCollectionTemplateIds>;
type UseInfiniteTemplatesResult = ReturnType<
   typeof useInfiniteLoadTemplateDescriptors
>;

const toastMock = toast as jest.MockedFunction<typeof toast>;

const useAddTemplateToCollectionMock =
   useAddTemplateToCollection as jest.MockedFunction<
      typeof useAddTemplateToCollection
   >;
const useRemoveTemplateFromCollectionMock =
   useRemoveTemplateFromCollection as jest.MockedFunction<
      typeof useRemoveTemplateFromCollection
   >;
const useLoadCollectionTemplateIdsMock =
   useLoadCollectionTemplateIds as jest.MockedFunction<
      typeof useLoadCollectionTemplateIds
   >;
const useInfiniteLoadTemplateDescriptorsMock =
   useInfiniteLoadTemplateDescriptors as jest.MockedFunction<
      typeof useInfiniteLoadTemplateDescriptors
   >;

const addMutationResultMock = (mutateFn = jest.fn()): UseAddTemplateResult => {
   return ctestData.useMutationResultMock(mutateFn) as UseAddTemplateResult;
};

const removeMutationResultMock = (
   mutateFn = jest.fn()
): UseRemoveTemplateResult => {
   return ctestData.useMutationResultMock(mutateFn) as UseRemoveTemplateResult;
};

const templateIdsQueryResultMock = (
   data: string[] | undefined,
   isLoading = false
): UseLoadTemplateIdsResult => {
   return { data, isLoading } as UseLoadTemplateIdsResult;
};

const infiniteQueryResultMock = (
   pages: DTemplateDescriptorsPage[] = [],
   hasNextPage = false,
   isFetching = false
): UseInfiniteTemplatesResult => {
   return {
      data: { pages, pageParams: [] },
      fetchNextPage: jest.fn(),
      hasNextPage,
      isFetching,
   } as unknown as UseInfiniteTemplatesResult;
};

const collectionId = "collection-1";

const setupDefaultMocks = () => {
   useAddTemplateToCollectionMock.mockReturnValue(addMutationResultMock());
   useRemoveTemplateFromCollectionMock.mockReturnValue(
      removeMutationResultMock()
   );
   useLoadCollectionTemplateIdsMock.mockReturnValue(
      templateIdsQueryResultMock([])
   );
   useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
      infiniteQueryResultMock()
   );
};

const assertRendered = () => {
   const collectionTemplates = screen.getByTestId("collection-templates");
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

describe("CollectionTemplates rendering tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      setupDefaultMocks();
   });

   it("idsLoading true - test", async () => {
      const templateIdsQueryResult = templateIdsQueryResultMock(
         undefined,
         true
      );
      useLoadCollectionTemplateIdsMock.mockReturnValue(templateIdsQueryResult);

      const { container } = renderWithReactQuery(
         <CollectionTemplates collectionId={collectionId} />
      );

      await waitFor(() => {
         assertRendered();
         assertTemplatesLoadingRendered();
      });

      expect(container).toMatchSnapshot();
   });

   it("in collection/not in collection - empty - test", async () => {
      const templateIdsQueryResult = templateIdsQueryResultMock([]);
      useLoadCollectionTemplateIdsMock.mockReturnValue(templateIdsQueryResult);

      const page = dtestData.dTemplateDescriptorsPage(0);
      const loadTemplatesQueryResult = infiniteQueryResultMock([page]);
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         loadTemplatesQueryResult
      );

      const { container } = renderWithReactQuery(
         <CollectionTemplates collectionId={collectionId} />
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
      const page = dtestData.dTemplateDescriptorsPage(6);
      const templateIds = [page.content[0].id];

      const templateIdsQueryResult = templateIdsQueryResultMock(templateIds);
      useLoadCollectionTemplateIdsMock.mockReturnValue(templateIdsQueryResult);

      const loadTemplatesQueryResult = infiniteQueryResultMock([page]);
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         loadTemplatesQueryResult
      );

      const { container } = renderWithReactQuery(
         <CollectionTemplates collectionId={collectionId} />
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

describe("CollectionTemplates functionality tests", () => {
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

      const templateIdsQueryResult = templateIdsQueryResultMock([]);
      useLoadCollectionTemplateIdsMock.mockReturnValue(templateIdsQueryResult);

      const page = dtestData.dTemplateDescriptorsPage(2);
      const loadTemplatesQueryResult = infiniteQueryResultMock([page]);
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         loadTemplatesQueryResult
      );

      const addResultMock = addMutationResultMock(mutateFn);
      useAddTemplateToCollectionMock.mockReturnValue(addResultMock);

      renderWithReactQuery(<CollectionTemplates collectionId={collectionId} />);

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

      const expectedParams: AddTemplateToCollectionParams = {
         collectionId,
         templateDescriptorId: page.content[0].id,
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
         expect(useLoadCollectionTemplateIdsMock).toHaveBeenCalledWith(
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

      const templateIdsQueryResult = templateIdsQueryResultMock([]);
      useLoadCollectionTemplateIdsMock.mockReturnValue(templateIdsQueryResult);

      const page = dtestData.dTemplateDescriptorsPage(3);
      const loadTemplatesQueryResult = infiniteQueryResultMock([page]);
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         loadTemplatesQueryResult
      );

      const addResultMock = addMutationResultMock(mutateFn);
      useAddTemplateToCollectionMock.mockReturnValue(addResultMock);

      renderWithReactQuery(<CollectionTemplates collectionId={collectionId} />);

      await waitFor(() => {
         assertRendered();
         assertTemplatesListRendered();
         assertTemplateRows(3, false);
      });

      const addBtn = screen.getAllByTestId("add-template-btn");
      await userEvent.click(addBtn[0]);

      const expectedParams: AddTemplateToCollectionParams = {
         collectionId,
         templateDescriptorId: page.content[0].id,
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
         expect(useLoadCollectionTemplateIdsMock).toHaveBeenCalledWith(
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

      const page = dtestData.dTemplateDescriptorsPage(6);
      const templateIds = [page.content[0].id];

      const templateIdsQueryResult = templateIdsQueryResultMock(templateIds);
      useLoadCollectionTemplateIdsMock.mockReturnValue(templateIdsQueryResult);

      const loadTemplatesQueryResult = infiniteQueryResultMock([page]);
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         loadTemplatesQueryResult
      );

      const removeResultMock = removeMutationResultMock(mutateFn);
      useRemoveTemplateFromCollectionMock.mockReturnValue(removeResultMock);

      renderWithReactQuery(<CollectionTemplates collectionId={collectionId} />);

      const removeBtn = screen.getAllByTestId("remove-template-btn");
      await userEvent.click(removeBtn[0]);

      const expectedParams: AddTemplateToCollectionParams = {
         collectionId,
         templateDescriptorId: page.content[0].id,
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
         expect(useLoadCollectionTemplateIdsMock).toHaveBeenCalledWith(
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

      const page = dtestData.dTemplateDescriptorsPage(1);
      const templateIds = [page.content[0].id];

      const templateIdsQueryResult = templateIdsQueryResultMock(templateIds);
      useLoadCollectionTemplateIdsMock.mockReturnValue(templateIdsQueryResult);

      const loadTemplatesQueryResult = infiniteQueryResultMock([page]);
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         loadTemplatesQueryResult
      );

      const removeResultMock = removeMutationResultMock(mutateFn);
      useRemoveTemplateFromCollectionMock.mockReturnValue(removeResultMock);

      renderWithReactQuery(<CollectionTemplates collectionId={collectionId} />);

      const removeBtn = screen.getAllByTestId("remove-template-btn");
      await userEvent.click(removeBtn[0]);

      const expectedParams: AddTemplateToCollectionParams = {
         collectionId,
         templateDescriptorId: page.content[0].id,
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
         expect(useLoadCollectionTemplateIdsMock).toHaveBeenCalledWith(
            collectionId
         );
      });
   });

   it("search input test", async () => {
      renderWithReactQuery(<CollectionTemplates collectionId={collectionId} />);

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
