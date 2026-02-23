jest.mock("@/data/actions/library");

import {
   InfiniteData,
   QueryFunction,
   QueryFunctionContext,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
   UndefinedInitialDataOptions,
   UseMutationOptions,
} from "@tanstack/react-query";
import { waitFor } from "@testing-library/dom";
import { dtestData, renderHookWithReactQuery } from "@tests";

import {
   addEntryToCollection,
   createLibraryCollection,
   deleteLibraryCollection,
   getLibraryCategories,
   getLibraryCollections,
   getLibraryEntriesPage,
   getLibraryModels,
   removeEntryFromCollection,
   toggleLibraryEntryFavorite,
   updateLibraryCollection,
} from "@/data/actions/library";
import {
   DLibraryEntriesPage,
   DLibraryEntriesPageQuery,
} from "@/data/types/domain/library";
import { ActionResult } from "@/data/types/utils";

import {
   infiniteLoadLibraryEntriesOptions,
   preloadLibraryEntriesOptions,
   toggleFavoriteOptions,
   useInfiniteLoadLibraryEntries,
   useToggleFavorite,
} from "./library";
import { LoadLibraryEntriesParams, UpdateIsFavoriteParams } from "./types";

const getLibraryEntriesPageMock = getLibraryEntriesPage as jest.MockedFunction<
   typeof getLibraryEntriesPage
>;

const toggleLibraryEntryFavoriteMock =
   toggleLibraryEntryFavorite as jest.MockedFunction<
      typeof toggleLibraryEntryFavorite
   >;

describe("prefetch options tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   test("preloadLibraryEntriesOptions  - test", async () => {
      const page = dtestData.dLibraryEntriesPage();
      getLibraryEntriesPageMock.mockResolvedValue(page);

      const filters = dtestData.dLibraryEntriesFilter();
      const params: LoadLibraryEntriesParams = { filters };

      const options = preloadLibraryEntriesOptions(params);
      const queryFn = options.queryFn as QueryFunction<DLibraryEntriesPage>;
      const context = {} as QueryFunctionContext;
      const fnResult = await queryFn(context);

      const expectedOptions: UndefinedInitialDataOptions<
         DLibraryEntriesPage,
         Error,
         DLibraryEntriesPage
      > = {
         queryKey: ["library", "entries", filters],
         queryFn: jest.fn(),
      };

      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
      expect(getLibraryEntriesPageMock).toHaveBeenCalledTimes(1);
      expect(fnResult).toEqual(page);
   });
});

describe("loadLibraryEntries hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("infiniteLoadLibraryEntriesOptions - test", async () => {
      const filters = dtestData.dLibraryEntriesFilter();
      const params: LoadLibraryEntriesParams = { filters };

      const expectedOptions: UndefinedInitialDataInfiniteOptions<
         DLibraryEntriesPage,
         Error,
         InfiniteData<DLibraryEntriesPage, unknown>,
         QueryKey,
         number
      > = {
         queryKey: ["library", "entries", filters],
         queryFn: jest.fn(),
         initialPageParam: 1,
         getNextPageParam: jest.fn(),
         staleTime: 5 * 60 * 1000,
      };

      const options = infiniteLoadLibraryEntriesOptions(params);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useInfiniteLoadLibraryEntries test", async () => {
      const page = dtestData.dLibraryEntriesPage();
      getLibraryEntriesPageMock.mockResolvedValue(page);

      const filters = dtestData.dLibraryEntriesFilter();
      const params: LoadLibraryEntriesParams = { filters };

      const { result } = renderHookWithReactQuery(() =>
         useInfiniteLoadLibraryEntries(params)
      );

      const expectedQuery: DLibraryEntriesPageQuery = {
         pagination: {
            pageNumber: 1,
            pageSize: 10,
         },
         filter: params.filters,
      };

      await waitFor(() => {
         expect(result.current.data?.pageParams).toEqual([1]);
         expect(result.current.data?.pages).toHaveLength(1);
         expect(result.current.data?.pages[0]).toEqual(page);
         expect(getLibraryEntriesPageMock).toHaveBeenCalledTimes(1);
         expect(getLibraryEntriesPageMock).toHaveBeenCalledWith(expectedQuery);
      });
   });
});

describe("toggleFavorite hooks tests", () => {
   test("toggleFavoriteOptions test", async () => {
      const expectedOptions: UseMutationOptions<
         ActionResult,
         Error,
         UpdateIsFavoriteParams
      > = {
         mutationFn: jest.fn(),
         onSuccess: jest.fn(),
      };

      const options = toggleFavoriteOptions();
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useToggleFavorite test", async () => {
      const { result } = renderHookWithReactQuery(() => useToggleFavorite());

      const params: UpdateIsFavoriteParams = {
         entryId: "1",
         isFavorite: true,
      };

      await waitFor(() => {
         result.current.mutate(params);
         expect(result.current.isSuccess).toBe(true);
         expect(toggleLibraryEntryFavoriteMock).toHaveBeenCalledTimes(1);
         expect(toggleLibraryEntryFavoriteMock).toHaveBeenCalledWith(
            params.entryId,
            params.isFavorite
         );
      });
   });
});
