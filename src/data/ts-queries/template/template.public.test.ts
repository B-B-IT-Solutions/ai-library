jest.mock("@/data/actions/template");

import {
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
} from "@tanstack/react-query";
import { waitFor } from "@testing-library/dom";
import { dtestData, renderHookWithReactQuery } from "@tests";

import { getPublicTemplateDescriptorsPage } from "@/data/actions/template";
import {
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";

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
      const filters = dtestData.dTemplateDescriptorsFilter();
      const sort = dtestData.sort();
      const params: LoadTemplateDescriptorsParams = { filters, sort };

      const expectedOptions: UndefinedInitialDataInfiniteOptions<
         DTemplateDescriptorsPage,
         Error,
         InfiniteData<DTemplateDescriptorsPage, unknown>,
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
      const page = dtestData.dTemplateDescriptorsPage();
      getPublicTemplateDescriptorsPageMock.mockResolvedValue(page);

      const filters = dtestData.dTemplateDescriptorsFilter();
      const sort = dtestData.sort();
      const params: LoadTemplateDescriptorsParams = { filters, sort };

      const { result } = renderHookWithReactQuery(() =>
         useInfiniteLoadPublicTemplateDescriptors(params)
      );

      const expectedQuery: DTemplateDescriptorsPageQuery = {
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
