import { DCollectionUpdate } from "@/data/types/domain/collection";

export const initCollection = (): DCollectionUpdate => {
   return {
      name: "",
      description: "",
      color: "#3b82f6",
   };
};
