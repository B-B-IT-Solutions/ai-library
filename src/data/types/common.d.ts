export interface Page<T = object> {
   hasMore: boolean;
   content: T[];
}

export type Pagination = {
   pageSize: number;
   pageNumber: number;
};

export type Filter = Record<string, FitlerValue>;

export interface PageQuery<T extends Filter> {
   pagination?: Pagination;
   sort?: string;
   filter?: T;
   globalFilter?: string;
}
