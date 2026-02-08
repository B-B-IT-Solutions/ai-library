import { ZodError } from "zod";

import {
   promptTemplateFieldSchema,
   promptTemplateFieldTypeSchema,
   templateFieldValuesSchema,
} from "./prompt.template.schema";

describe("promptTemplateFieldTypeSchema - tests", () => {
   it("promptTemplateFieldTypeSchema - TEXT type valid - test", () => {
      const validatedValue = promptTemplateFieldTypeSchema.parse("TEXT");
      expect(validatedValue).toBe("TEXT");
   });

   it("promptTemplateFieldTypeSchema - TEXTAREA type valid - test", () => {
      const validatedValue = promptTemplateFieldTypeSchema.parse("TEXTAREA");
      expect(validatedValue).toBe("TEXTAREA");
   });

   it("promptTemplateFieldTypeSchema - SELECT type valid - test", () => {
      const validatedValue = promptTemplateFieldTypeSchema.parse("SELECT");
      expect(validatedValue).toBe("SELECT");
   });

   it("promptTemplateFieldTypeSchema - CHECKBOX type valid - test", () => {
      const validatedValue = promptTemplateFieldTypeSchema.parse("CHECKBOX");
      expect(validatedValue).toBe("CHECKBOX");
   });

   it("promptTemplateFieldTypeSchema - RADIO type valid - test", () => {
      const validatedValue = promptTemplateFieldTypeSchema.parse("RADIO");
      expect(validatedValue).toBe("RADIO");
   });

   it("promptTemplateFieldTypeSchema - NUMBER type valid - test", () => {
      const validatedValue = promptTemplateFieldTypeSchema.parse("NUMBER");
      expect(validatedValue).toBe("NUMBER");
   });

   it("promptTemplateFieldTypeSchema - DATE type valid - test", () => {
      const validatedValue = promptTemplateFieldTypeSchema.parse("DATE");
      expect(validatedValue).toBe("DATE");
   });

   it("promptTemplateFieldTypeSchema - EMAIL type valid - test", () => {
      const validatedValue = promptTemplateFieldTypeSchema.parse("EMAIL");
      expect(validatedValue).toBe("EMAIL");
   });

   it("promptTemplateFieldTypeSchema - invalid type - test", () => {
      const fn = () => promptTemplateFieldTypeSchema.parse("INVALID_TYPE");
      expect(fn).toThrow(ZodError);
   });

   it("promptTemplateFieldTypeSchema - empty string - test", () => {
      const fn = () => promptTemplateFieldTypeSchema.parse("");
      expect(fn).toThrow(ZodError);
   });
});

describe("promptTemplateFieldSchema - tests", () => {
   it("promptTemplateFieldSchema - complete valid data - test", () => {
      const fieldData = {
         name: "email",
         label: "Email Address",
         description: "Enter your email address",
         type: "EMAIL" as const,
         required: true,
         order: 1,
         defaultValue: "user@example.com",
         options: ["option1", "option2"],
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues).toEqual(fieldData);
   });

   it("promptTemplateFieldSchema - minimal valid data with defaults - test", () => {
      const fieldData = {
         name: "name",
         label: "Name",
         type: "TEXT" as const,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues).toEqual({
         name: "name",
         label: "Name",
         type: "TEXT",
         required: true,
         order: 0,
      });
   });

   it("promptTemplateFieldSchema - name empty string invalid - test", () => {
      const fieldData = {
         name: "",
         label: "Label",
         type: "TEXT" as const,
      };

      const fn = () => promptTemplateFieldSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("promptTemplateFieldSchema - name exceeds max length - test", () => {
      const fieldData = {
         name: "a".repeat(101),
         label: "Label",
         type: "TEXT" as const,
      };

      const fn = () => promptTemplateFieldSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("promptTemplateFieldSchema - name at max length valid - test", () => {
      const fieldData = {
         name: "a".repeat(100),
         label: "Label",
         type: "TEXT" as const,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.name).toBe("a".repeat(100));
   });

   it("promptTemplateFieldSchema - label empty string invalid - test", () => {
      const fieldData = {
         name: "name",
         label: "",
         type: "TEXT" as const,
      };

      const fn = () => promptTemplateFieldSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("promptTemplateFieldSchema - label exceeds max length - test", () => {
      const fieldData = {
         name: "name",
         label: "a".repeat(251),
         type: "TEXT" as const,
      };

      const fn = () => promptTemplateFieldSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("promptTemplateFieldSchema - label at max length valid - test", () => {
      const fieldData = {
         name: "name",
         label: "a".repeat(250),
         type: "TEXT" as const,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.label).toBe("a".repeat(250));
   });

   it("promptTemplateFieldSchema - description optional - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.description).toBeUndefined();
   });

   it("promptTemplateFieldSchema - description exceeds max length - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         description: "a".repeat(501),
         type: "TEXT" as const,
      };

      const fn = () => promptTemplateFieldSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("promptTemplateFieldSchema - description at max length valid - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         description: "a".repeat(500),
         type: "TEXT" as const,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.description).toBe("a".repeat(500));
   });

   it("promptTemplateFieldSchema - invalid type - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "INVALID",
      };

      const fn = () => promptTemplateFieldSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("promptTemplateFieldSchema - required defaults to true - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.required).toBe(true);
   });

   it("promptTemplateFieldSchema - required can be false - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         required: false,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.required).toBe(false);
   });

   it("promptTemplateFieldSchema - order defaults to 0 - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.order).toBe(0);
   });

   it("promptTemplateFieldSchema - order can be positive integer - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         order: 5,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.order).toBe(5);
   });

   it("promptTemplateFieldSchema - order can be negative integer - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         order: -1,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.order).toBe(-1);
   });

   it("promptTemplateFieldSchema - order must be integer - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         order: 1.5,
      };

      const fn = () => promptTemplateFieldSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("promptTemplateFieldSchema - defaultValue optional - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.defaultValue).toBeUndefined();
   });

   it("promptTemplateFieldSchema - defaultValue can be set - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         defaultValue: "Default text",
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.defaultValue).toBe("Default text");
   });

   it("promptTemplateFieldSchema - options optional - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "SELECT" as const,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.options).toBeUndefined();
   });

   it("promptTemplateFieldSchema - options can be array of strings - test", () => {
      const fieldData = {
         name: "country",
         label: "Country",
         type: "SELECT" as const,
         options: ["USA", "UK", "Germany"],
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.options).toEqual(["USA", "UK", "Germany"]);
   });

   it("promptTemplateFieldSchema - options can be empty array - test", () => {
      const fieldData = {
         name: "country",
         label: "Country",
         type: "SELECT" as const,
         options: [],
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.options).toEqual([]);
   });

   it("promptTemplateFieldSchema - missing name invalid - test", () => {
      const fieldData = {
         label: "Label",
         type: "TEXT" as const,
      };

      const fn = () => promptTemplateFieldSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("promptTemplateFieldSchema - missing label invalid - test", () => {
      const fieldData = {
         name: "name",
         type: "TEXT" as const,
      };

      const fn = () => promptTemplateFieldSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("promptTemplateFieldSchema - missing type invalid - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
      };

      const fn = () => promptTemplateFieldSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("promptTemplateFieldSchema - all field types valid - test", () => {
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
         const fieldData = {
            name: "field",
            label: "Field",
            type: type,
         };

         const validatedValues = promptTemplateFieldSchema.parse(fieldData);
         expect(validatedValues.type).toBe(type);
      });
   });
});

describe("templateFieldValuesSchema - tests", () => {
   it("templateFieldValuesSchema - valid string values - test", () => {
      const values = {
         name: "User-1 Name",
         email: "test1@email.com",
         message: "Hello",
      };

      const validatedValues = templateFieldValuesSchema.parse(values);
      expect(validatedValues).toEqual(values);
   });

   it("templateFieldValuesSchema - valid mixed type values - test", () => {
      const values = {
         name: "John",
         age: 30,
         active: true,
         score: 95.5,
      };

      const validatedValues = templateFieldValuesSchema.parse(values);
      expect(validatedValues).toEqual(values);
   });

   it("templateFieldValuesSchema - empty record valid - test", () => {
      const values = {};

      const validatedValues = templateFieldValuesSchema.parse(values);
      expect(validatedValues).toEqual({});
   });

   it("templateFieldValuesSchema - null values allowed - test", () => {
      const values = {
         name: "John",
         middleName: null,
      };

      const validatedValues = templateFieldValuesSchema.parse(values);
      expect(validatedValues).toEqual(values);
   });

   it("templateFieldValuesSchema - undefined values allowed - test", () => {
      const values = {
         name: "John",
         middleName: undefined,
      };

      const validatedValues = templateFieldValuesSchema.parse(values);
      expect(validatedValues).toEqual(values);
   });

   it("templateFieldValuesSchema - array values allowed - test", () => {
      const values = {
         name: "John",
         hobbies: ["reading", "coding", "gaming"],
      };

      const validatedValues = templateFieldValuesSchema.parse(values);
      expect(validatedValues).toEqual(values);
   });

   it("templateFieldValuesSchema - nested object values allowed - test", () => {
      const values = {
         name: "John",
         address: {
            street: "123 Main St",
            city: "New York",
         },
      };

      const validatedValues = templateFieldValuesSchema.parse(values);
      expect(validatedValues).toEqual(values);
   });

   it("templateFieldValuesSchema - numeric string keys valid - test", () => {
      const values = {
         "123": "value1",
         "456": "value2",
      };

      const validatedValues = templateFieldValuesSchema.parse(values);
      expect(validatedValues).toEqual(values);
   });

   it("templateFieldValuesSchema - keys with special characters valid - test", () => {
      const values = {
         "user-name": "John",
         user_email: "test1@email.com",
         "user.phone": "123-456-7890",
      };

      const validatedValues = templateFieldValuesSchema.parse(values);
      expect(validatedValues).toEqual(values);
   });
});
