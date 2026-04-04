import { DLibraryCollectionUpdate } from "@/data/types/domain/collection";

export const initLibraryCollection = (): DLibraryCollectionUpdate => {
   return {
      name: "",
      description: "",
      color: "#3b82f6",
   };
};
