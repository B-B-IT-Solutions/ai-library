import { Filter, Page, PageQuery, Sort, SortOrder } from "@/data/types/common";
import {
   TanstackFilterQueryKey,
   TanstackPageQueryKey,
   TanstackParamQueryKey,
} from "@/data/types/domain/common";

const SORT_REGEX = /^(asc|desc)\((.+)\)$/;

export const getNextPageParam = <T>(lastPage: Page<T>) => {
   const { pageNumber, totalPages } = lastPage;
   if (pageNumber < totalPages - 1) {
      return pageNumber + 1;
   }
   return null;
};

export const pageQuery = <TFilter extends Filter>(
   pageNumber: number,
   pageSize: number,
   globalFilter?: string,
   filter?: TFilter,
   sort?: Sort
): PageQuery<TFilter> => {
   const query: PageQuery<TFilter> = {
      pagination: { pageNumber, pageSize },
      globalFilter,
      sort,
      filter,
   };
   return query;
};

export const pageQueryKey = (
   query?: PageQuery<Filter>
): TanstackPageQueryKey<PageQuery<Filter>> => {
   if (query) {
      return { query };
   }
   return {};
};

export const filterQueryKey = (
   filter?: Filter,
   sort?: Sort
): TanstackFilterQueryKey<Filter> => {
   if (filter && sort) {
      return { filter, sort };
   }
   if (filter) {
      return { filter };
   }
   if (sort) {
      return { sort };
   }
   return {};
};

export const paramQueryKey = <T>(params?: T): TanstackParamQueryKey<T> => {
   if (params) {
      return { params };
   }
   return {};
};

export const resolveSort = (sortBy?: string): Sort | undefined => {
   if (sortBy) {
      const match = sortBy.match(SORT_REGEX);
      if (match) {
         const [, order, field] = match;

         const sort: Sort = {
            order: order as SortOrder,
            field,
         };
         return sort;
      }
   }
   return undefined;
};
