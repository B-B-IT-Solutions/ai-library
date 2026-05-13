jest.mock("@/data/actions/template");

import {
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
} from "@tanstack/react-query";
import { waitFor } from "@testing-library/dom";
import { dtestData, renderHookWithReactQuery } from "@tests";

import { getPublicTemplateDescriptorsPage } from "@/data/actions/prompt";
import { DPromptsPage, DPromptsPageQuery } from "@/data/types/domain/prompt";

import {
   infiniteLoadPublicTemplateDescriptorsOptions,
   useInfiniteLoadPublicTemplateDescriptors,
} from "./template.public";
import { LoadTemplateDescriptorsParams } from "./types";

const getPublicTemplateDescriptorsPageMock =
   getPublicTemplateDescriptorsPage as jest.MockedFunction<
      typeof getPublicTemplateDescriptorsPage
   >;

describe("loadTemplateDescriptors hooks tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("infiniteLoadPublicTemplateDescriptorsOptions - test", async () => {
      const filters = dtestData.dPromptsFilter();
      const sort = dtestData.sort();
      const params: LoadTemplateDescriptorsParams = { filters, sort };

      const expectedOptions: UndefinedInitialDataInfiniteOptions<
         DPromptsPage,
         Error,
         InfiniteData<DPromptsPage, unknown>,
         QueryKey,
         number
      > = {
         queryKey: ["templates", "public", { filters, sort }],
         queryFn: jest.fn(),
         initialPageParam: 0,
         getNextPageParam: jest.fn(),
         staleTime: 5 * 60 * 1000,
      };

      const options = infiniteLoadPublicTemplateDescriptorsOptions(params);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useInfiniteLoadPublicTemplateDescriptors test", async () => {
      const page = dtestData.dPromptsPage();
      getPublicTemplateDescriptorsPageMock.mockResolvedValue(page);

      const filters = dtestData.dPromptsFilter();
      const sort = dtestData.sort();
      const params: LoadTemplateDescriptorsParams = { filters, sort };

      const { result } = renderHookWithReactQuery(() =>
         useInfiniteLoadPublicTemplateDescriptors(params)
      );

      const expectedQuery: DPromptsPageQuery = {
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
         expect(getPublicTemplateDescriptorsPageMock).toHaveBeenCalledTimes(1);
         expect(getPublicTemplateDescriptorsPageMock).toHaveBeenCalledWith(
            expectedQuery
         );
      });
   });
});
