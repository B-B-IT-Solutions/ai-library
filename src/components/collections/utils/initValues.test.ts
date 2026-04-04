import { DLibraryCollectionUpdate } from "@/data/types/domain/collection";

import { initLibraryCollection } from "./initValues";

export const expectedInitLibraryCollection: DLibraryCollectionUpdate = {
   name: "",
   description: "",
   color: "#3b82f6",
};

describe("initLibraryCollection tests", () => {
   it("initLibraryCollection test", () => {
      const initValue = initLibraryCollection();
      expect(initValue).toEqual(expectedInitLibraryCollection);
   });
});
