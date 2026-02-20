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

export type DListViewMode = "grid" | "list";

export type DListGroupByMode =
   | "none"
   | "category"
   | "model"
   | "date"
   | "collection";
