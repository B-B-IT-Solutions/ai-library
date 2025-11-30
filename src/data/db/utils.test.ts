import { INIT_PAGE_NUMBER, PAGE_SIZE } from "@/lib/constants";

import { DEFAULT_PAGINATION } from "./utils";

const expectedDefaultPagination = {
   pageNumber: INIT_PAGE_NUMBER,
   pageSize: PAGE_SIZE,
};

describe("utils tests", () => {
   it("utils test", async () => {
      expect(DEFAULT_PAGINATION).toEqual(expectedDefaultPagination);
   });
});
