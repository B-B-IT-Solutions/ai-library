jest.mock("@/data/actions/prompt/prompt.actions");

import {
   InfiniteData,
   QueryKey,
   UndefinedInitialDataInfiniteOptions,
} from "@tanstack/react-query";
import { waitFor } from "@testing-library/dom";
import { dtestData, renderHookWithReactQuery } from "@tests";

import { getPrompts } from "@/data/actions/prompt/prompt.actions";
import { DPromptsPage, DPromptsPageQuery } from "@/data/types/domain/prompt";

import { infiniteLoadPromptsOptions, useInfiniteLoadPrompts } from "./prompt";
import { LoadPromptsParams } from "./types";

const getPromptsMock = getPrompts as jest.MockedFunction<typeof getPrompts>;

describe("loadNote hooks tests", () => {
   test("infiniteLoadPromptsOptions - test", async () => {
      const filter = dtestData.dPromptsFilter();
      const params: LoadPromptsParams = {
         search: "test 1",
         categories: filter.categories,
      };

      const expectedOptions: UndefinedInitialDataInfiniteOptions<
         DPromptsPage,
         Error,
         InfiniteData<DPromptsPage, unknown>,
         QueryKey,
         number
      > = {
         queryKey: ["prompts", { params }],
         queryFn: jest.fn(),
         initialPageParam: 0,
         getNextPageParam: jest.fn(),
         staleTime: 5 * 60 * 1000,
      };

      const options = infiniteLoadPromptsOptions(params);
      expect(JSON.stringify(options)).toEqual(JSON.stringify(expectedOptions));
   });

   test("useInfiniteLoadPrompts test", async () => {
      const promptsPage = dtestData.dPromptsPage();
      getPromptsMock.mockResolvedValue(promptsPage);
      const filter = dtestData.dPromptsFilter();
      const params: LoadPromptsParams = {
         search: "test 1",
         categories: filter.categories,
      };

      const { result } = renderHookWithReactQuery(() =>
         useInfiniteLoadPrompts(params)
      );

      const expectedQuery: DPromptsPageQuery = {
         pagination: { pageNumber: 0, pageSize: 7 },
         globalFilter: params.search,
         filter: filter,
      };

      await waitFor(() => {
         expect(result.current.data?.pageParams).toEqual([0]);
         expect(result.current.data?.pages).toHaveLength(1);
         expect(result.current.data?.pages[0]).toEqual(promptsPage);
         expect(getPromptsMock).toHaveBeenCalledTimes(1);
         expect(getPromptsMock).toHaveBeenCalledWith(expectedQuery);
      });
   });
});
