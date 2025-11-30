export type CallbackFn = () => void;

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
