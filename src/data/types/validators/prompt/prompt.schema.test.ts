import { title } from "process";
import { ZodError } from "zod";

import {
   updatePromptFollowUpSchema,
   updatePromptSchema,
} from "./prompt.schema";

describe("updatePromptFollowUpSchema - tests", () => {
   it("updatePromptFollowUpSchema - complete valid data - test", () => {
      const data = {
         id: "follow-up-1",
         content: "What else would you like to know?",
         order: 0,
      };

      const result = updatePromptFollowUpSchema.parse(data);
      expect(result).toEqual(data);
   });

   it("updatePromptFollowUpSchema - id optional - test", () => {
      const data = {
         content: "Follow-up question",
         order: 1,
      };

      const result = updatePromptFollowUpSchema.parse(data);
      expect(result.id).toBeUndefined();
      expect(result.content).toBe("Follow-up question");
      expect(result.order).toBe(1);
   });

   it("updatePromptFollowUpSchema - order can be 0 - test", () => {
      const data = { content: "Content", order: 0 };

      const result = updatePromptFollowUpSchema.parse(data);
      expect(result.order).toBe(0);
   });

   it("updatePromptFollowUpSchema - order can be positive integer - test", () => {
      const data = { content: "Content", order: 5 };

      const result = updatePromptFollowUpSchema.parse(data);
      expect(result.order).toBe(5);
   });

   it("updatePromptFollowUpSchema - order can be negative integer - test", () => {
      const data = { content: "Content", order: -1 };

      const result = updatePromptFollowUpSchema.parse(data);
      expect(result.order).toBe(-1);
   });

   it("updatePromptFollowUpSchema - missing content invalid - test", () => {
      const data = { order: 0 };

      const fn = () => updatePromptFollowUpSchema.parse(data);
      expect(fn).toThrow(ZodError);
   });

   it("updatePromptFollowUpSchema - missing order invalid - test", () => {
      const data = { content: "Content" };

      const fn = () => updatePromptFollowUpSchema.parse(data);
      expect(fn).toThrow(ZodError);
   });

   it("updatePromptFollowUpSchema - order not a number invalid - test", () => {
      const data = { content: "Content", order: "first" };

      const fn = () => updatePromptFollowUpSchema.parse(data);
      expect(fn).toThrow(ZodError);
   });

   it("updatePromptFollowUpSchema - content empty string valid - test", () => {
      const data = { content: "", order: 0 };

      const result = updatePromptFollowUpSchema.parse(data);
      expect(result.content).toBe("");
   });
});

describe("updatePromptSchema - tests", () => {
   const validFollowUp = {
      id: "fu-1",
      content: "Tell me more",
      order: 0,
   };

   const validData = {
      title: "My Prompt",
      content: "Write a summary about {{topic}}",
      categories: ["Marketing", "Sales"],
      recommendedModel: "claude-sonnet-4-6",
      followUpPrompts: [validFollowUp],
   };

   describe("Valid data", () => {
      it("updatePromptSchema - complete valid data - test", () => {
         const result = updatePromptSchema.parse(validData);
         expect(result).toEqual(validData);
      });

      it("updatePromptSchema - empty categories array valid - test", () => {
         const data = { ...validData, categories: [] };

         const result = updatePromptSchema.parse(data);
         expect(result.categories).toEqual([]);
      });

      it("updatePromptSchema - empty followUpPrompts array valid - test", () => {
         const data = { ...validData, followUpPrompts: [] };

         const result = updatePromptSchema.parse(data);
         expect(result.followUpPrompts).toEqual([]);
      });

      it("updatePromptSchema - multiple categories valid - test", () => {
         const data = {
            ...validData,
            categories: ["Marketing", "Sales", "Support"],
         };

         const result = updatePromptSchema.parse(data);
         expect(result.categories).toHaveLength(3);
      });

      it("updatePromptSchema - multiple followUpPrompts valid - test", () => {
         const data = {
            ...validData,
            followUpPrompts: [
               { content: "Follow up 1", order: 0 },
               { content: "Follow up 2", order: 1 },
               { id: "fu-3", content: "Follow up 3", order: 2 },
            ],
         };

         const result = updatePromptSchema.parse(data);
         expect(result.followUpPrompts).toHaveLength(3);
      });

      it("updatePromptSchema - empty content valid - test", () => {
         const data = { ...validData, content: "" };

         const result = updatePromptSchema.parse(data);
         expect(result.content).toBe("");
      });
   });

   describe("Title validation", () => {
      it("updatePromptSchema - title with exactly 3 characters valid - test", () => {
         const data = { ...validData, title: "ABC" };

         const result = updatePromptSchema.parse(data);
         expect(result.title).toBe("ABC");
      });

      it("updatePromptSchema - title with 2 characters invalid - test", () => {
         const data = { ...validData, title: "AB" };

         const fn = () => updatePromptSchema.parse(data);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptSchema - title empty string invalid - test", () => {
         const data = { ...validData, title: "" };

         const fn = () => updatePromptSchema.parse(data);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptSchema - missing title invalid - test", () => {
         const data = { ...validData, title: undefined };

         const fn = () => updatePromptSchema.parse(data);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptSchema - title error message - test", () => {
         const data = { ...validData, title: "AB" };

         try {
            updatePromptSchema.parse(data);
         } catch (error) {
            expect(error).toBeInstanceOf(ZodError);
            const zodError = error as ZodError;
            const titleError = zodError.issues.find(
               (e) => e.path[0] === "title"
            );
            expect(titleError?.message).toBe("Titel ist erforderlich");
         }
      });
   });

   describe("Content validation", () => {
      it("updatePromptSchema - missing content invalid - test", () => {
         const data = { ...validData, content: undefined };

         const fn = () => updatePromptSchema.parse(data);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptSchema - content with template variables valid - test", () => {
         const data = {
            ...validData,
            content: "Hello {{name}}, your topic is {{topic}}!",
         };

         const result = updatePromptSchema.parse(data);
         expect(result.content).toBe(
            "Hello {{name}}, your topic is {{topic}}!"
         );
      });
   });

   describe("Categories validation", () => {
      it("updatePromptSchema - missing categories invalid - test", () => {
         const data = { ...validData, categories: undefined };

         const fn = () => updatePromptSchema.parse(data);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptSchema - categories must be array - test", () => {
         const data = { ...validData, categories: "Marketing" };

         const fn = () => updatePromptSchema.parse(data);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptSchema - single category valid - test", () => {
         const data = { ...validData, categories: ["Marketing"] };

         const result = updatePromptSchema.parse(data);
         expect(result.categories).toEqual(["Marketing"]);
      });
   });

   describe("RecommendedModel validation", () => {
      it("updatePromptSchema - empty recommendedModel valid - test", () => {
         const data = { ...validData, recommendedModel: "" };

         const result = updatePromptSchema.parse(data);
         expect(result.recommendedModel).toBe("");
      });

      it("updatePromptSchema - missing recommendedModel invalid - test", () => {
         const data = { ...validData, recommendedModel: undefined };

         const fn = () => updatePromptSchema.parse(data);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptSchema - different model names valid - test", () => {
         const models = [
            "claude-sonnet-4-6",
            "claude-opus-4-6",
            "gpt-4",
            "custom-model",
         ];

         models.forEach((model) => {
            const data = { ...validData, recommendedModel: model };
            const result = updatePromptSchema.parse(data);
            expect(result.recommendedModel).toBe(model);
         });
      });
   });

   describe("FollowUpPrompts validation", () => {
      it("updatePromptSchema - missing followUpPrompts invalid - test", () => {
         const data = { ...validData, followUpPrompts: undefined };

         const fn = () => updatePromptSchema.parse(data);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptSchema - followUpPrompts must be array - test", () => {
         const data = { ...validData, followUpPrompts: "not an array" };

         const fn = () => updatePromptSchema.parse(data);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptSchema - invalid followUpPrompt in array invalid - test", () => {
         const data = {
            ...validData,
            followUpPrompts: [{ content: "Missing order" }],
         };

         const fn = () => updatePromptSchema.parse(data);
         expect(fn).toThrow(ZodError);
      });
   });

   describe("Complex scenarios", () => {
      it("updatePromptSchema - real world prompt data - test", () => {
         const realWorldData = {
            title: "Blog Post Generator",
            content:
               "Write a blog post about {{topic}} targeting {{audience}}. Tone: {{tone}}.",
            categories: ["Content", "Marketing"],
            recommendedModel: "claude-sonnet-4-6",
            followUpPrompts: [
               { content: "Make it shorter", order: 0 },
               { content: "Make it more formal", order: 1 },
               { id: "fu-3", content: "Add more examples", order: 2 },
            ],
         };

         const result = updatePromptSchema.parse(realWorldData);
         expect(result.title).toBe("Blog Post Generator");
         expect(result.followUpPrompts).toHaveLength(3);
         expect(result.categories).toHaveLength(2);
      });

      it("updatePromptSchema - minimal valid data - test", () => {
         const minimalData = {
            title: "Min",
            content: "",
            categories: [],
            recommendedModel: "",
            followUpPrompts: [],
         };

         const result = updatePromptSchema.parse(minimalData);
         expect(result).toEqual(minimalData);
      });
   });
});
