jest.mock("@/data/actions/catalog");

import {
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
} from "@tanstack/react-query";
import { waitFor } from "@testing-library/dom";
import { dtestData, renderHookWithReactQuery } from "@tests";

import { getPublishedCatalogEntriesPage } from "@/data/actions/catalog";
import {
   DCatalogEntriesPage,
   DCatalogEntriesPageQuery,
} from "@/data/types/domain/catalog";

import {
   infiniteLoadCatalogEntryDescriptorsOptions,
   useInfiniteLoadCatalogEntryDescriptors,
} from "./catalog";
import { LoadCatalogEntriesParams } from "./types";

const getPublishedCatalogEntriesPageMock =
   getPublishedCatalogEntriesPage as jest.MockedFunction<
      typeof getPublishedCatalogEntriesPage
   >;

describe("loadCatalogEntryDescriptors hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("infiniteLoadCatalogEntryDescriptorsOptions - test", async () => {
      const filters = dtestData.dCatalogEntriesFilter();
      const sort = dtestData.sort();
      const params: LoadCatalogEntriesParams = { filters, sort };

      const expectedOptions: UndefinedInitialDataInfiniteOptions<
         DCatalogEntriesPage,
         Error,
         InfiniteData<DCatalogEntriesPage, unknown>,
         QueryKey,
         number
      > = {
         queryKey: ["catalog-entries", { filters, sort }],
         queryFn: jest.fn(),
         initialPageParam: 0,
         getNextPageParam: jest.fn(),
         staleTime: 5 * 60 * 1000,
      };

      const options = infiniteLoadCatalogEntryDescriptorsOptions(params);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useInfiniteLoadCatalogEntryDescriptors test", async () => {
      const page = dtestData.dCatalogEntriesPage();
      getPublishedCatalogEntriesPageMock.mockResolvedValue(page);

      const filters = dtestData.dPromptsFilter();
      const sort = dtestData.sort();
      const params: LoadCatalogEntriesParams = { filters, sort };

      const { result } = renderHookWithReactQuery(() =>
         useInfiniteLoadCatalogEntryDescriptors(params)
      );

      const expectedQuery: DCatalogEntriesPageQuery = {
         pagination: {
            pageNumber: 0,
            pageSize: 10,
         },
         filter: params.filters,
         sort: params.sort,
      };

      await waitFor(() => {
         expect(result.current.data?.pageParams).toEqual([0]);
         expect(result.current.data?.pages).toHaveLength(1);
         expect(result.current.data?.pages[0]).toEqual(page);
         expect(getPublishedCatalogEntriesPageMock).toHaveBeenCalledTimes(1);
         expect(getPublishedCatalogEntriesPageMock).toHaveBeenCalledWith(
            expectedQuery
         );
      });
   });
});
