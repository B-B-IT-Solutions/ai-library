import { DLibraryCollectionUpdate } from "@/data/types/domain/library";

export const initLibraryCollection = (): DLibraryCollectionUpdate => {
   return {
      name: "",
      description: "",
      color: "#3b82f6",
   };
};
