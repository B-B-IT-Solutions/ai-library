import { dtestData } from "@tests";

import {
   breadcrumbRootUrl,
   isEditMode,
   newWorkflowUrl,
   worfklowEditNavigateBackUrl,
} from "./utils";

describe("isEditMode - tests", () => {
   it("isEditMode false - test", () => {
      const result = isEditMode();
      expect(result).toBe(false);

      const workflow = dtestData.dWorkflow();
      const result2 = isEditMode(workflow);
      expect(result2).toBe(true);
   });

   it("isEditMode true - test", () => {
      const workflow = dtestData.dWorkflow();
      const result = isEditMode(workflow);
      expect(result).toBe(true);
   });
});

describe("newWorkflowUrl - tests", () => {
   it("url - test", () => {
      const result = newWorkflowUrl();
      expect(result).toBe("/workflows/new");
   });
});

describe("worfklowEditNavigateBackUrl - tests", () => {
   it("workflow undefined - test", () => {
      const result = worfklowEditNavigateBackUrl();
      expect(result).toBe("/workflows");
   });

   it("workflow defined - test", () => {
      const workflow = dtestData.dWorkflow();
      const result = worfklowEditNavigateBackUrl(workflow);
      expect(result).toBe(`/workflows/${workflow.id}`);
   });
});

describe("breadcrumbRootUrl - tests", () => {
   it("url - test", () => {
      const result = breadcrumbRootUrl();
      expect(result).toBe("/workflows");
   });
});
