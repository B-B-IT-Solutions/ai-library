import { DCollection, DCollectionUpdate } from "@/data/types/domain/collection";

export const initCollection = (collection?: DCollection): DCollectionUpdate => {
   return {
      name: collection?.name ?? "",
      description: collection?.description ?? "",
      color: collection?.color ?? "#3b82f6",
      order: collection?.order ?? 0,
   };
};
