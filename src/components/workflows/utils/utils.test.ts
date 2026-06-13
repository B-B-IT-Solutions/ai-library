import { newWorkflowUrl } from "./utils";

describe("newWorkflowUrl - tests", () => {
   it("url - test", () => {
      const result = newWorkflowUrl();
      expect(result).toBe("/workflows/new");
   });
});
