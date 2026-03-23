import { Sort } from "@/data/types/common";

export type TanstackParamQueryKey<T> = {
   params?: T;
};

export type TanstackPageQueryKey<T> = {
   query?: T;
};

export type TanstackFilterQueryKey<T> = {
   filters?: T;
   sort?: Sort;
};

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
   DATE_DESC = "desc(createdAt)",
   DATE_ASC = "asc(createdAt)",
   NAME_DESC = "desc(title)",
   NAME_ASC = "asc(title)",
}
