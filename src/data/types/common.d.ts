export interface Page<T = object> {
   content: T[];
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

export interface Sort {
   field: string;
   desc: boolean;
}
