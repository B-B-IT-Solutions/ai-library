import { TanstackQueryKey } from "@/data/types/domain/common";

export const queryKey = <T>(params?: T): TanstackQueryKey<T> => {
   if (params) {
      return { params };
   }
   return {};
};
