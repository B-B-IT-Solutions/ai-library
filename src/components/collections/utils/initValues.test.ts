import { DLibraryCollectionUpdate } from "@/data/types/domain/library";

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
