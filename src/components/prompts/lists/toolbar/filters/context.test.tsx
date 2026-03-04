import { DPromptDescriptorsFilter } from "@/data/types/domain/prompt";

import { initFilters } from "./context";

const expectedInitFilters: DPromptDescriptorsFilter = {
   search: "",
   categories: [],
};

describe("FiltersContext tests", () => {
   test("expectedInitFilters test", async () => {
      expect(initFilters).toEqual(expectedInitFilters);
   });
});
