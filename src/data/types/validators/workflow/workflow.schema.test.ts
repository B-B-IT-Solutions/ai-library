import { ZodError } from "zod";

import {
   updateWorkflowEdgeSchema,
   updateWorkflowSchema,
   updateWorkflowStepSchema,
} from "./workflow.schema";

const UUID_1 = "550e8400-e29b-41d4-a716-446655440000";
const UUID_2 = "550e8400-e29b-41d4-a716-446655440001";
const UUID_3 = "550e8400-e29b-41d4-a716-446655440002";
const UUID_4 = "550e8400-e29b-41d4-a716-446655440003";
const UUID_5 = "550e8400-e29b-41d4-a716-446655440004";

const validEdge = {
   toStepId: UUID_1,
   label: "Weiter",
   order: 0,
};

const validStepPromptRef = {
   id: UUID_2,
   title: "Schritt 1",
   hint: null,
   type: "PROMPT_REF" as const,
   promptId: UUID_3,
   content: null,
   isStart: true,
   position: 0,
   edgeId: UUID_4,
   edges: [validEdge],
};

const validStepStandalone = {
   title: "Schritt 2",
   type: "STANDALONE" as const,
   content: "Dies ist der Inhalt.",
   isStart: false,
   position: 1,
   edgeId: UUID_5,
   edges: [],
};

describe("updateWorkflowEdgeSchema", () => {
   it("data valid - all fields - test", () => {
      const result = updateWorkflowEdgeSchema.parse(validEdge);
      expect(result).toEqual(validEdge);
   });

   it("data invalid - toStepId not a uuid - test", () => {
      const fn = () =>
         updateWorkflowEdgeSchema.parse({ ...validEdge, toStepId: "not-a-uuid" });
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - label empty - test", () => {
      const fn = () =>
         updateWorkflowEdgeSchema.parse({ ...validEdge, label: "" });
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - label exceeds max length - test", () => {
      const fn = () =>
         updateWorkflowEdgeSchema.parse({ ...validEdge, label: "a".repeat(251) });
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - order negative - test", () => {
      const fn = () =>
         updateWorkflowEdgeSchema.parse({ ...validEdge, order: -1 });
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - order not an integer - test", () => {
      const fn = () =>
         updateWorkflowEdgeSchema.parse({ ...validEdge, order: 1.5 });
      expect(fn).toThrow(ZodError);
   });
});

describe("updateWorkflowStepSchema", () => {
   it("data valid - PROMPT_REF with promptId - test", () => {
      const result = updateWorkflowStepSchema.parse(validStepPromptRef);
      expect(result).toEqual(validStepPromptRef);
   });

   it("data valid - STANDALONE with content - test", () => {
      const result = updateWorkflowStepSchema.parse(validStepStandalone);
      expect(result).toEqual(validStepStandalone);
   });

   it("data valid - id optional - test", () => {
      const { id: _id, ...withoutId } = validStepPromptRef;
      const result = updateWorkflowStepSchema.parse(withoutId);
      expect(result.id).toBeUndefined();
   });

   it("data valid - hint provided - test", () => {
      const data = { ...validStepPromptRef, hint: "Hilfe" };
      const result = updateWorkflowStepSchema.parse(data);
      expect(result.hint).toBe("Hilfe");
   });

   it("data invalid - title empty - test", () => {
      const fn = () =>
         updateWorkflowStepSchema.parse({ ...validStepPromptRef, title: "" });
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - title exceeds max length - test", () => {
      const fn = () =>
         updateWorkflowStepSchema.parse({
            ...validStepPromptRef,
            title: "a".repeat(251),
         });
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - hint exceeds max length - test", () => {
      const fn = () =>
         updateWorkflowStepSchema.parse({
            ...validStepPromptRef,
            hint: "a".repeat(751),
         });
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - type not in enum - test", () => {
      const fn = () =>
         updateWorkflowStepSchema.parse({ ...validStepPromptRef, type: "UNKNOWN" });
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - edgeId not a uuid - test", () => {
      const fn = () =>
         updateWorkflowStepSchema.parse({
            ...validStepPromptRef,
            edgeId: "not-a-uuid",
         });
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - PROMPT_REF without promptId - test", () => {
      const fn = () =>
         updateWorkflowStepSchema.parse({
            ...validStepPromptRef,
            promptId: null,
         });
      const error = fn as () => never;
      expect(error).toThrow(ZodError);

      try {
         fn();
      } catch (e) {
         const zodError = e as ZodError;
         const promptIdIssue = zodError.issues.find(
            (i) => i.path[0] === "promptId"
         );
         expect(promptIdIssue?.message).toBe("Bitte einen Prompt auswählen");
      }
   });

   it("data invalid - STANDALONE without content - test", () => {
      const fn = () =>
         updateWorkflowStepSchema.parse({ ...validStepStandalone, content: null });
      expect(fn).toThrow(ZodError);

      try {
         fn();
      } catch (e) {
         const zodError = e as ZodError;
         const contentIssue = zodError.issues.find(
            (i) => i.path[0] === "content"
         );
         expect(contentIssue?.message).toBe("Prompt-Text darf nicht leer sein");
      }
   });

   it("data invalid - STANDALONE with whitespace-only content - test", () => {
      const fn = () =>
         updateWorkflowStepSchema.parse({
            ...validStepStandalone,
            content: "   ",
         });
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - position negative - test", () => {
      const fn = () =>
         updateWorkflowStepSchema.parse({
            ...validStepPromptRef,
            position: -1,
         });
      expect(fn).toThrow(ZodError);
   });
});

describe("updateWorkflowSchema", () => {
   const validWorkflow = {
      title: "Mein Workflow",
      description: "Beschreibung",
      steps: [validStepPromptRef],
   };

   it("data valid - all fields - test", () => {
      const result = updateWorkflowSchema.parse(validWorkflow);
      expect(result).toEqual(validWorkflow);
   });

   it("data valid - description nullish - test", () => {
      const data = { ...validWorkflow, description: null };
      const result = updateWorkflowSchema.parse(data);
      expect(result.description).toBeNull();
   });

   it("data valid - empty steps array - test", () => {
      const result = updateWorkflowSchema.parse({ ...validWorkflow, steps: [] });
      expect(result.steps).toEqual([]);
   });

   it("data invalid - title empty - test", () => {
      const fn = () =>
         updateWorkflowSchema.parse({ ...validWorkflow, title: "" });
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - title exceeds max length - test", () => {
      const fn = () =>
         updateWorkflowSchema.parse({
            ...validWorkflow,
            title: "a".repeat(251),
         });
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - description exceeds max length - test", () => {
      const fn = () =>
         updateWorkflowSchema.parse({
            ...validWorkflow,
            description: "a".repeat(751),
         });
      expect(fn).toThrow(ZodError);
   });

   it("data invalid - step in array invalid - test", () => {
      const fn = () =>
         updateWorkflowSchema.parse({
            ...validWorkflow,
            steps: [{ ...validStepPromptRef, title: "" }],
         });
      expect(fn).toThrow(ZodError);
   });
});
