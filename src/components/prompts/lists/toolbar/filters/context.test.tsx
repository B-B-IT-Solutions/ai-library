import { DPrompt0sFilter } from "@/data/types/domain/prompt0";

import { initFilters } from "./context";

const expectedInitFilters: DPrompt0sFilter = {
   search: "",
   categories: [],
};

describe("FiltersContext tests", () => {
   test("expectedInitFilters test", async () => {
      expect(initFilters).toEqual(expectedInitFilters);
   });
});
