import { DCollectionUpdate } from "@/data/types/domain/collection";

import { initCollection } from "./initValues";

export const expectedInitCollection: DCollectionUpdate = {
   name: "",
   description: "",
   color: "#3b82f6",
};

describe("initCollection tests", () => {
   it("values test", () => {
      const initValue = initCollection();
      expect(initValue).toEqual(expectedInitCollection);
   });
});
