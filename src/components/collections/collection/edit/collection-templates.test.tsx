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
   useAddTemplateToCollection,
   useLoadCollectionTemplateIds,
   useRemoveTemplateFromCollection,
} from "@/data/ts-queries/collection";
import { useInfiniteLoadTemplateDescriptors } from "@/data/ts-queries/library";
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

   it("in collection empty - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors(3);
      const page: DTemplateDescriptorsPage = {
         content: templates,
         numberOfElements: templates.length,
         pageNumber: 1,
         pageSize: 3,
         totalElements: 3,
         totalPages: 1,
      };

      const templateIdsQueryResult = templateIdsQueryResultMock([]);
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
         assertInCollecitonEmpty();
      });

      expect(container).toMatchSnapshot();
   });

   it("shows 'Keine Vorlagen gefunden' when no templates exist at all", async () => {
      const page: DTemplateDescriptorsPage = {
         content: [],
         numberOfElements: 0,
         pageNumber: 1,
         pageSize: 3,
         totalElements: 0,
         totalPages: 0,
      };

      useLoadCollectionTemplateIdsMock.mockReturnValue(
         templateIdsQueryResultMock([])
      );
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         infiniteQueryResultMock([page])
      );

      const { container } = renderWithReactQuery(
         <CollectionTemplates collectionId={collectionId} />
      );

      await waitFor(() => {
         const empty = screen.getByText("Keine Vorlagen gefunden");
         assertInDocument(empty);
      });

      expect(container).toMatchSnapshot();
   });

   it("shows 'Keine weiteren Vorlagen gefunden' when all templates are in collection", async () => {
      const templates = dtestData.dPromptTemplateDescriptors(3);
      const templateIds = templates.map((t) => t.id);
      const page: DTemplateDescriptorsPage = {
         content: templates,
         numberOfElements: templates.length,
         pageNumber: 1,
         pageSize: 3,
         totalElements: 3,
         totalPages: 1,
      };

      useLoadCollectionTemplateIdsMock.mockReturnValue(
         templateIdsQueryResultMock(templateIds)
      );
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         infiniteQueryResultMock([page])
      );

      const { container } = renderWithReactQuery(
         <CollectionTemplates collectionId={collectionId} />
      );

      await waitFor(() => {
         const empty = screen.getByText("Keine weiteren Vorlagen gefunden");
         assertInDocument(empty);
      });

      expect(container).toMatchSnapshot();
   });

   it("renders templates split between in-collection and not-in-collection", async () => {
      const templates = dtestData.dPromptTemplateDescriptors(4);
      const inCollectionIds = [templates[0].id, templates[1].id];
      const page: DTemplateDescriptorsPage = {
         content: templates,
         numberOfElements: templates.length,
         pageNumber: 1,
         pageSize: 4,
         totalElements: 4,
         totalPages: 1,
      };

      useLoadCollectionTemplateIdsMock.mockReturnValue(
         templateIdsQueryResultMock(inCollectionIds)
      );
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         infiniteQueryResultMock([page])
      );

      const { container } = renderWithReactQuery(
         <CollectionTemplates collectionId={collectionId} />
      );

      await waitFor(() => {
         assertInDocument(screen.getByText(templates[0].title));
         assertInDocument(screen.getByText(templates[1].title));
         assertInDocument(screen.getByText(templates[2].title));
         assertInDocument(screen.getByText(templates[3].title));
      });

      expect(container).toMatchSnapshot();
   });

   it("shows template count in section header", async () => {
      const templates = dtestData.dPromptTemplateDescriptors(3);
      const inCollectionIds = [templates[0].id];
      const page: DTemplateDescriptorsPage = {
         content: templates,
         numberOfElements: templates.length,
         pageNumber: 1,
         pageSize: 3,
         totalElements: 3,
         totalPages: 1,
      };

      useLoadCollectionTemplateIdsMock.mockReturnValue(
         templateIdsQueryResultMock(inCollectionIds)
      );
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         infiniteQueryResultMock([page])
      );

      renderWithReactQuery(<CollectionTemplates collectionId={collectionId} />);

      await waitFor(() => {
         assertInDocument(
            screen.getByText(`In dieser Sammlung (${inCollectionIds.length})`)
         );
      });
   });

   it("renders recommendedModel badge when present", async () => {
      const template = dtestData.dPromptTemplateDescriptor(1);
      const page: DTemplateDescriptorsPage = {
         content: [template],
         numberOfElements: 1,
         pageNumber: 1,
         pageSize: 1,
         totalElements: 1,
         totalPages: 1,
      };

      useLoadCollectionTemplateIdsMock.mockReturnValue(
         templateIdsQueryResultMock([])
      );
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         infiniteQueryResultMock([page])
      );

      renderWithReactQuery(<CollectionTemplates collectionId={collectionId} />);

      await waitFor(() => {
         assertInDocument(screen.getByText(template.recommendedModel!));
      });
   });
});

describe("CollectionTemplates functionality tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      setupDefaultMocks();
   });

   it("add template - success true - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors(2);
      const page: DTemplateDescriptorsPage = {
         content: templates,
         numberOfElements: templates.length,
         pageNumber: 1,
         pageSize: 2,
         totalElements: 2,
         totalPages: 1,
      };

      const actionResult: ActionResult = {
         success: true,
         message: "Hinzugefügt",
      };
      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
         callbacks.onSettled();
      });

      useLoadCollectionTemplateIdsMock.mockReturnValue(
         templateIdsQueryResultMock([])
      );
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         infiniteQueryResultMock([page])
      );
      useAddTemplateToCollectionMock.mockReturnValue(
         addMutationResultMock(mutateFn)
      );

      renderWithReactQuery(<CollectionTemplates collectionId={collectionId} />);

      await waitFor(() => {
         assertInDocument(screen.getByText(templates[0].title));
      });

      const addButtons = screen.getAllByRole("button");
      await userEvent.click(addButtons[0]);

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(mutateFn).toHaveBeenCalledWith(
            {
               collectionId,
               templateDescriptorId: templates[0].id,
            },
            expect.objectContaining({
               onSuccess: expect.any(Function),
               onSettled: expect.any(Function),
            })
         );
         expect(toastMock.error).not.toHaveBeenCalled();
      });
   });

   it("add template - success false - shows error toast", async () => {
      const templates = dtestData.dPromptTemplateDescriptors(1);
      const page: DTemplateDescriptorsPage = {
         content: templates,
         numberOfElements: 1,
         pageNumber: 1,
         pageSize: 1,
         totalElements: 1,
         totalPages: 1,
      };

      const actionResult: ActionResult = {
         success: false,
         message: "Fehler beim Hinzufügen",
      };
      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
         callbacks.onSettled();
      });

      useLoadCollectionTemplateIdsMock.mockReturnValue(
         templateIdsQueryResultMock([])
      );
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         infiniteQueryResultMock([page])
      );
      useAddTemplateToCollectionMock.mockReturnValue(
         addMutationResultMock(mutateFn)
      );

      renderWithReactQuery(<CollectionTemplates collectionId={collectionId} />);

      await waitFor(() => {
         assertInDocument(screen.getByText(templates[0].title));
      });

      const addButtons = screen.getAllByRole("button");
      await userEvent.click(addButtons[0]);

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(actionResult.message);
      });
   });

   it("remove template - success true - test", async () => {
      const templates = dtestData.dPromptTemplateDescriptors(1);
      const inCollectionIds = [templates[0].id];
      const page: DTemplateDescriptorsPage = {
         content: templates,
         numberOfElements: 1,
         pageNumber: 1,
         pageSize: 1,
         totalElements: 1,
         totalPages: 1,
      };

      const actionResult: ActionResult = { success: true, message: "Entfernt" };
      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
         callbacks.onSettled();
      });

      useLoadCollectionTemplateIdsMock.mockReturnValue(
         templateIdsQueryResultMock(inCollectionIds)
      );
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         infiniteQueryResultMock([page])
      );
      useRemoveTemplateFromCollectionMock.mockReturnValue(
         removeMutationResultMock(mutateFn)
      );

      renderWithReactQuery(<CollectionTemplates collectionId={collectionId} />);

      await waitFor(() => {
         assertInDocument(screen.getByText(templates[0].title));
      });

      const removeButtons = screen.getAllByRole("button");
      await userEvent.click(removeButtons[0]);

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(mutateFn).toHaveBeenCalledWith(
            {
               collectionId,
               templateDescriptorId: templates[0].id,
            },
            expect.objectContaining({
               onSuccess: expect.any(Function),
               onSettled: expect.any(Function),
            })
         );
         expect(toastMock.error).not.toHaveBeenCalled();
      });
   });

   it("remove template - success false - shows error toast", async () => {
      const templates = dtestData.dPromptTemplateDescriptors(1);
      const inCollectionIds = [templates[0].id];
      const page: DTemplateDescriptorsPage = {
         content: templates,
         numberOfElements: 1,
         pageNumber: 1,
         pageSize: 1,
         totalElements: 1,
         totalPages: 1,
      };

      const actionResult: ActionResult = {
         success: false,
         message: "Fehler beim Entfernen",
      };
      const mutateFn = jest.fn((_params: unknown, callbacks) => {
         callbacks.onSuccess(actionResult);
         callbacks.onSettled();
      });

      useLoadCollectionTemplateIdsMock.mockReturnValue(
         templateIdsQueryResultMock(inCollectionIds)
      );
      useInfiniteLoadTemplateDescriptorsMock.mockReturnValue(
         infiniteQueryResultMock([page])
      );
      useRemoveTemplateFromCollectionMock.mockReturnValue(
         removeMutationResultMock(mutateFn)
      );

      renderWithReactQuery(<CollectionTemplates collectionId={collectionId} />);

      await waitFor(() => {
         assertInDocument(screen.getByText(templates[0].title));
      });

      const removeButtons = screen.getAllByRole("button");
      await userEvent.click(removeButtons[0]);

      await waitFor(() => {
         expect(mutateFn).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledTimes(1);
         expect(toastMock.error).toHaveBeenCalledWith(actionResult.message);
      });
   });

   it("search input filters templates", async () => {
      renderWithReactQuery(<CollectionTemplates collectionId={collectionId} />);

      const input = screen.getByPlaceholderText("Vorlagen durchsuchen...");
      await userEvent.type(input, "test");

      await waitFor(() => {
         expect(useInfiniteLoadTemplateDescriptorsMock).toHaveBeenCalledWith(
            expect.objectContaining({
               filters: expect.objectContaining({ search: "test" }),
            })
         );
      });
   });

   it("search undefined when input is empty", async () => {
      renderWithReactQuery(<CollectionTemplates collectionId={collectionId} />);

      await waitFor(() => {
         expect(useInfiniteLoadTemplateDescriptorsMock).toHaveBeenCalledWith(
            expect.objectContaining({
               filters: expect.objectContaining({ search: undefined }),
            })
         );
      });
   });

   it("useLoadCollectionTemplateIds called with correct collectionId", async () => {
      renderWithReactQuery(<CollectionTemplates collectionId={collectionId} />);

      await waitFor(() => {
         expect(useLoadCollectionTemplateIdsMock).toHaveBeenCalledWith(
            collectionId
         );
      });
   });
});
