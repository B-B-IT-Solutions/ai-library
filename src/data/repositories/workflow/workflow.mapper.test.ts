import {
   WorkflowDetailRow,
   WorkflowWithStepCount,
} from "@/data/types/db/workflow";

import {
   toDWorkflow,
   toDWorkflowDetail,
   toDWorkflows,
} from "./workflow.mapper";

const baseDate = new Date("2025-01-01T00:00:00Z");

const makePWorkflow = (overrides = {}): WorkflowWithStepCount => ({
   id: "wf-1",
   userId: "user-1",
   title: "Test Workflow",
   description: "A description",
   createdAt: baseDate,
   updatedAt: baseDate,
   _count: { steps: 3 },
   ...overrides,
});

describe("toDWorkflow", () => {
   it("maps a workflow with step count to DWorkflow", () => {
      const result = toDWorkflow(makePWorkflow());
      expect(result).toEqual({
         id: "wf-1",
         title: "Test Workflow",
         description: "A description",
         stepCount: 3,
         createdAt: baseDate.toISOString(),
         updatedAt: baseDate.toISOString(),
      });
   });

   it("maps null description correctly", () => {
      const result = toDWorkflow(makePWorkflow({ description: null }));
      expect(result.description).toBeNull();
   });
});

describe("toDWorkflows", () => {
   it("maps an array of workflows", () => {
      const workflows = [
         makePWorkflow(),
         makePWorkflow({ id: "wf-2", title: "Second" }),
      ];
      const result = toDWorkflows(workflows);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe("wf-1");
      expect(result[1].id).toBe("wf-2");
   });
});

describe("toDWorkflowDetail", () => {
   it("maps a workflow with steps and edges", () => {
      const row: WorkflowDetailRow = {
         id: "wf-1",
         userId: "user-1",
         title: "My Workflow",
         description: null,
         createdAt: baseDate,
         updatedAt: baseDate,
         _count: { steps: 1 },
         steps: [
            {
               id: "step-1",
               workflowId: "wf-1",
               title: "First Step",
               hint: "A hint",
               type: "STANDALONE",
               templateId: null,
               content: "Do something",
               isStart: true,
               position: 0,
               createdAt: baseDate,
               updatedAt: baseDate,
               template: null,
               outgoingEdges: [
                  {
                     id: "edge-1",
                     fromStepId: "step-1",
                     toStepId: "step-2",
                     label: "Weiter",
                     order: 0,
                     createdAt: baseDate,
                  },
               ],
            },
         ],
      };

      const result = toDWorkflowDetail(row);

      expect(result.id).toBe("wf-1");
      expect(result.steps).toHaveLength(1);
      expect(result.steps[0].title).toBe("First Step");
      expect(result.steps[0].hint).toBe("A hint");
      expect(result.steps[0].isStart).toBe(true);
      expect(result.steps[0].promptTitle).toBeNull();
      expect(result.steps[0].outgoingEdges).toHaveLength(1);
      expect(result.steps[0].outgoingEdges[0].label).toBe("Weiter");
   });

   it("maps templateTitle from template relation", () => {
      const row: WorkflowDetailRow = {
         id: "wf-1",
         userId: "user-1",
         title: "Workflow",
         description: null,
         createdAt: baseDate,
         updatedAt: baseDate,
         _count: { steps: 1 },
         steps: [
            {
               id: "step-1",
               workflowId: "wf-1",
               title: "Template Step",
               hint: null,
               type: "PROMPT_REF",
               promptId: "tmpl-1",
               content: null,
               isStart: true,
               position: 0,
               createdAt: baseDate,
               updatedAt: baseDate,
               template: { title: "My Template" },
               outgoingEdges: [],
            },
         ],
      };

      const result = toDWorkflowDetail(row);
      expect(result.steps[0].promptTitle).toBe("My Template");
   });
});
