import { ZodError } from "zod";

import { globalTemplateFieldSchema } from "./settings.schema";

describe("globalTemplateFieldSchema tests", () => {
   const validField = {
      name: "fieldName",
      label: "Field Label",
      type: "TEXT" as const,
      required: true,
      order: 0,
   };

   it("data valid - all fields - test", () => {
      const fieldData = {
         name: "fieldName",
         label: "Field Label",
         description: "A description",
         type: "TEXT" as const,
         required: true,
         defaultValue: "default",
         options: ["a", "b"],
         order: 1,
      };

      const result = globalTemplateFieldSchema.parse(fieldData);
      expect(result).toEqual(fieldData);
   });

   it("data valid - only required fields - test", () => {
      const result = globalTemplateFieldSchema.parse(validField);
      expect(result).toEqual(validField);
   });

   describe("name validation", () => {
      it("name - empty string - invalid - test", () => {
         const fn = () =>
            globalTemplateFieldSchema.parse({ ...validField, name: "" });
         expect(fn).toThrow(ZodError);
      });

      it("name - missing - invalid - test", () => {
         const { name: _, ...withoutName } = validField;
         const fn = () => globalTemplateFieldSchema.parse(withoutName);
         expect(fn).toThrow(ZodError);
      });

      it("name - max length valid - test", () => {
         const result = globalTemplateFieldSchema.parse({
            ...validField,
            name: "a".repeat(50),
         });
         expect(result.name).toBe("a".repeat(50));
      });

      it("name - exceeds max length - invalid - test", () => {
         const fn = () =>
            globalTemplateFieldSchema.parse({
               ...validField,
               name: "a".repeat(51),
            });
         expect(fn).toThrow(ZodError);
      });

      it("name - contains spaces - invalid - test", () => {
         const fn = () =>
            globalTemplateFieldSchema.parse({
               ...validField,
               name: "field name",
            });
         expect(fn).toThrow(ZodError);
      });

      it("name - contains leading space - invalid - test", () => {
         const fn = () =>
            globalTemplateFieldSchema.parse({
               ...validField,
               name: " fieldName",
            });
         expect(fn).toThrow(ZodError);
      });
   });

   describe("label validation", () => {
      it("label - empty string - invalid - test", () => {
         const fn = () =>
            globalTemplateFieldSchema.parse({ ...validField, label: "" });
         expect(fn).toThrow(ZodError);
      });

      it("label - missing - invalid - test", () => {
         const { label: _, ...withoutLabel } = validField;
         const fn = () => globalTemplateFieldSchema.parse(withoutLabel);
         expect(fn).toThrow(ZodError);
      });

      it("label - max length valid - test", () => {
         const result = globalTemplateFieldSchema.parse({
            ...validField,
            label: "a".repeat(250),
         });
         expect(result.label).toBe("a".repeat(250));
      });

      it("label - exceeds max length - invalid - test", () => {
         const fn = () =>
            globalTemplateFieldSchema.parse({
               ...validField,
               label: "a".repeat(251),
            });
         expect(fn).toThrow(ZodError);
      });
   });

   describe("description validation", () => {
      it("description - optional - test", () => {
         const result = globalTemplateFieldSchema.parse(validField);
         expect(result.description).toBeUndefined();
      });

      it("description - max length valid - test", () => {
         const result = globalTemplateFieldSchema.parse({
            ...validField,
            description: "a".repeat(500),
         });
         expect(result.description).toBe("a".repeat(500));
      });

      it("description - exceeds max length - invalid - test", () => {
         const fn = () =>
            globalTemplateFieldSchema.parse({
               ...validField,
               description: "a".repeat(501),
            });
         expect(fn).toThrow(ZodError);
      });
   });

   describe("type validation", () => {
      it("type - missing - invalid - test", () => {
         const { type: _, ...withoutType } = validField;
         const fn = () => globalTemplateFieldSchema.parse(withoutType);
         expect(fn).toThrow(ZodError);
      });

      it("type - invalid value - invalid - test", () => {
         const fn = () =>
            globalTemplateFieldSchema.parse({ ...validField, type: "INVALID" });
         expect(fn).toThrow(ZodError);
      });

      it("type - all valid enum values - test", () => {
         const types = [
            "TEXT",
            "TEXTAREA",
            "SELECT",
            "CHECKBOX",
            "RADIO",
            "NUMBER",
            "DATE",
            "EMAIL",
         ] as const;

         types.forEach((type) => {
            const result = globalTemplateFieldSchema.parse({
               ...validField,
               type,
            });
            expect(result.type).toBe(type);
         });
      });
   });

   describe("required validation", () => {
      it("required - true - valid - test", () => {
         const result = globalTemplateFieldSchema.parse({
            ...validField,
            required: true,
         });
         expect(result.required).toBe(true);
      });

      it("required - false - valid - test", () => {
         const result = globalTemplateFieldSchema.parse({
            ...validField,
            required: false,
         });
         expect(result.required).toBe(false);
      });
   });

   describe("defaultValue validation", () => {
      it("defaultValue - optional - test", () => {
         const result = globalTemplateFieldSchema.parse(validField);
         expect(result.defaultValue).toBeUndefined();
      });

      it("defaultValue - can be set - test", () => {
         const result = globalTemplateFieldSchema.parse({
            ...validField,
            defaultValue: "my default",
         });
         expect(result.defaultValue).toBe("my default");
      });
   });

   describe("options validation", () => {
      it("options - optional - test", () => {
         const result = globalTemplateFieldSchema.parse(validField);
         expect(result.options).toBeUndefined();
      });

      it("options - array of strings - valid - test", () => {
         const result = globalTemplateFieldSchema.parse({
            ...validField,
            options: ["option1", "option2"],
         });
         expect(result.options).toEqual(["option1", "option2"]);
      });

      it("options - empty array - valid - test", () => {
         const result = globalTemplateFieldSchema.parse({
            ...validField,
            options: [],
         });
         expect(result.options).toEqual([]);
      });
   });

   describe("order validation", () => {
      it("order - zero - valid - test", () => {
         const result = globalTemplateFieldSchema.parse({
            ...validField,
            order: 0,
         });
         expect(result.order).toBe(0);
      });

      it("order - positive number - valid - test", () => {
         const result = globalTemplateFieldSchema.parse({
            ...validField,
            order: 5,
         });
         expect(result.order).toBe(5);
      });

      it("order - negative number - valid - test", () => {
         const result = globalTemplateFieldSchema.parse({
            ...validField,
            order: -1,
         });
         expect(result.order).toBe(-1);
      });

      it("order - float - valid - test", () => {
         const result = globalTemplateFieldSchema.parse({
            ...validField,
            order: 1.5,
         });
         expect(result.order).toBe(1.5);
      });

      it("order - string - invalid - test", () => {
         const fn = () =>
            globalTemplateFieldSchema.parse({ ...validField, order: "1" });
         expect(fn).toThrow(ZodError);
      });
   });
});
