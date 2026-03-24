export interface Page<T = object> {
   content: T[];
   numberOfElements: number;
   pageNumber: number;
   pageSize: number;
   totalElements: number;
   totalPages: number;
}

export type Pagination = {
   pageSize: number;
   pageNumber: number;
};

export type Filter = Record<string, FitlerValue>;

export interface PageQuery<T extends Filter> {
   pagination?: Pagination;
   sort?: Sort;
   filter?: T;
   globalFilter?: string;
}

export type SortOrder = "asc" | "desc";

export type Sort = {
   field: string;
   order: SortOrder;
};

export type CallbackFn = () => void;

export type AsyncCallbackFn = () => Promise<void>;
