import { Sort } from "@/data/types/common";

export interface TanstackParamQueryKey<T> {
   params?: T;
}

export interface TanstackPageQueryKey<T> {
   query?: T;
}

export interface TanstackFilterQueryKey<T> {
   filter?: T;
   sort?: Sort;
}

export enum DListViewMode {
   GRID = "grid",
   LIST = "list",
}

export enum DListGroupByMode {
   NONE = "none",
   CATEGORY = "category",
   MODEL = "model",
   DATE = "date",
   COLLECTION = "collection",
}

export enum DListSortByMode {
   DATE_DESC = "date-desc",
   DATE_ASC = "date-asc",
   NAME_ASC = "name-asc",
   NAME_DESC = "name-desc",
}
