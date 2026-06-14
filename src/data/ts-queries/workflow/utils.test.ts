import { dtestData } from "@tests";

import { workflowKeys } from "./utils";

describe("keys tests", () => {
   test("workflowKeys - test", async () => {
      const filters = dtestData.dWorkflowsFilter();
      const sort = dtestData.sort("title", "asc");

      expect(workflowKeys.all).toEqual(["workflows"]);
      expect(workflowKeys.workflows({})).toEqual(["workflows", {}]);
      expect(workflowKeys.workflows({ filters, sort })).toEqual([
         "workflows",
         { filters, sort },
      ]);
   });
});
