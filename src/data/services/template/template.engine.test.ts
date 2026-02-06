import {
   DTemplateField,
   DTemplateFieldValues,
} from "@/data/types/domain/template.field";

import { TemplateEngine } from "./template.engine";

describe("TemplateEngine.render - tests", () => {
   it("replaces single variable with value", () => {
      const template = "Hello {{name}}!";
      const values: DTemplateFieldValues = { name: "World" };
      const result = TemplateEngine.render(template, values);
      expect(result).toBe("Hello World!");
   });

   it("replaces multiple variables with values", () => {
      const template = "{{greeting}} {{name}}, you are {{age}} years old.";
      const values: DTemplateFieldValues = {
         greeting: "Hello",
         name: "John",
         age: "30",
      };
      const result = TemplateEngine.render(template, values);
      expect(result).toBe("Hello John, you are 30 years old.");
   });

   it("handles whitespace inside placeholders", () => {
      const template = "{{  name  }} is {{  age  }}";
      const values: DTemplateFieldValues = { name: "Alice", age: "25" };
      const result = TemplateEngine.render(template, values);
      expect(result).toBe("Alice is 25");
   });

   it("replaces same variable multiple times", () => {
      const template = "{{name}} and {{name}} are friends";
      const values: DTemplateFieldValues = { name: "Bob" };
      const result = TemplateEngine.render(template, values);
      expect(result).toBe("Bob and Bob are friends");
   });

   it("keeps placeholder when variable not in values", () => {
      const template = "Hello {{name}}!";
      const values: DTemplateFieldValues = {};
      const result = TemplateEngine.render(template, values);
      expect(result).toBe("Hello {{name}}!");
   });

   it("replaces null value with empty string", () => {
      const template = "Hello {{name}}!";
      const values: DTemplateFieldValues = { name: null };
      const result = TemplateEngine.render(template, values);
      expect(result).toBe("Hello !");
   });

   it("replaces undefined value with empty string", () => {
      const template = "Hello {{name}}!";
      const values: DTemplateFieldValues = { name: undefined };
      const result = TemplateEngine.render(template, values);
      expect(result).toBe("Hello !");
   });

   it("returns template unchanged when no variables present", () => {
      const template = "Hello World!";
      const values: DTemplateFieldValues = { name: "John" };
      const result = TemplateEngine.render(template, values);
      expect(result).toBe("Hello World!");
   });

   it("handles numeric values", () => {
      const template = "Price: {{price}}";
      const values: DTemplateFieldValues = { price: 100 };
      const result = TemplateEngine.render(template, values);
      expect(result).toBe("Price: 100");
   });

   it("handles empty template", () => {
      const template = "";
      const values: DTemplateFieldValues = { name: "John" };
      const result = TemplateEngine.render(template, values);
      expect(result).toBe("");
   });

   it("ignores values not in template", () => {
      const template = "Hello {{name}}";
      const values: DTemplateFieldValues = {
         name: "John",
         age: "30",
         city: "NYC",
      };
      const result = TemplateEngine.render(template, values);
      expect(result).toBe("Hello John");
   });
});

describe("TemplateEngine.validate - tests", () => {
   it("validates successfully when all required fields are filled", () => {
      const fields: DTemplateField[] = [
         {
            id: "1",
            promptTemplateId: "template1",
            name: "email",
            label: "Email",
            type: "EMAIL",
            required: true,
            order: 1,
         },
         {
            id: "2",
            promptTemplateId: "template1",
            name: "age",
            label: "Age",
            type: "NUMBER",
            required: true,
            order: 2,
         },
      ];
      const values: DTemplateFieldValues = {
         email: "test@example.com",
         age: "25",
      };
      const result = TemplateEngine.validate(fields, values);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
   });

   it("returns error when required field is missing", () => {
      const fields: DTemplateField[] = [
         {
            id: "1",
            promptTemplateId: "template1",
            name: "name",
            label: "Name",
            type: "TEXT",
            required: true,
            order: 1,
         },
      ];
      const values: DTemplateFieldValues = {};
      const result = TemplateEngine.validate(fields, values);

      const expectedErrors = {
         name: "Name ist erforderlich",
      };
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(expectedErrors);
   });

   it("returns error when required field is empty string", () => {
      const fields: DTemplateField[] = [
         {
            id: "1",
            promptTemplateId: "template1",
            name: "name",
            label: "Name",
            type: "TEXT",
            required: true,
            order: 1,
         },
      ];
      const values: DTemplateFieldValues = { name: "" };
      const result = TemplateEngine.validate(fields, values);

      const expectedErrors = {
         name: "Name ist erforderlich",
      };
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(expectedErrors);
   });

   it("validates email format correctly", () => {
      const fields: DTemplateField[] = [
         {
            id: "1",
            promptTemplateId: "template1",
            name: "email",
            label: "Email",
            type: "EMAIL",
            required: false,
            order: 1,
         },
      ];
      const values: DTemplateFieldValues = { email: "invalid-email" };
      const result = TemplateEngine.validate(fields, values);

      const expectedErrors = {
         email: "Ungültige E-Mail-Adresse",
      };
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(expectedErrors);
   });

   it("accepts valid email format", () => {
      const fields: DTemplateField[] = [
         {
            id: "1",
            promptTemplateId: "template1",
            name: "email",
            label: "Email",
            type: "EMAIL",
            required: false,
            order: 1,
         },
      ];
      const values: DTemplateFieldValues = { email: "user@example.com" };
      const result = TemplateEngine.validate(fields, values);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
   });

   it("validates number format correctly", () => {
      const fields: DTemplateField[] = [
         {
            id: "1",
            promptTemplateId: "template1",
            name: "age",
            label: "Age",
            type: "NUMBER",
            required: false,
            order: 1,
         },
      ];
      const values: DTemplateFieldValues = { age: "not-a-number" };
      const result = TemplateEngine.validate(fields, values);

      const expectedErrors = {
         age: "Muss eine Zahl sein",
      };
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(expectedErrors);
   });

   it("accepts valid number format", () => {
      const fields: DTemplateField[] = [
         {
            id: "1",
            promptTemplateId: "template1",
            name: "age",
            label: "Age",
            type: "NUMBER",
            required: false,
            order: 1,
         },
      ];
      const values: DTemplateFieldValues = { age: "42" };
      const result = TemplateEngine.validate(fields, values);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
   });

   it("accepts numeric values as numbers", () => {
      const fields: DTemplateField[] = [
         {
            id: "1",
            promptTemplateId: "template1",
            name: "age",
            label: "Age",
            type: "NUMBER",
            required: false,
            order: 1,
         },
      ];
      const values: DTemplateFieldValues = { age: 42 };
      const result = TemplateEngine.validate(fields, values);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
   });

   it("allows non-required fields to be empty", () => {
      const fields: DTemplateField[] = [
         {
            id: "1",
            promptTemplateId: "template1",
            name: "optional",
            label: "Optional Field",
            type: "TEXT",
            required: false,
            order: 1,
         },
      ];
      const values: DTemplateFieldValues = {};
      const result = TemplateEngine.validate(fields, values);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
   });

   it("validates multiple fields with mixed results", () => {
      const fields: DTemplateField[] = [
         {
            id: "1",
            promptTemplateId: "template1",
            name: "name",
            label: "Name",
            type: "TEXT",
            required: true,
            order: 1,
         },
         {
            id: "2",
            promptTemplateId: "template1",
            name: "email",
            label: "Email",
            type: "EMAIL",
            required: true,
            order: 2,
         },
         {
            id: "3",
            promptTemplateId: "template1",
            name: "age",
            label: "Age",
            type: "NUMBER",
            required: false,
            order: 3,
         },
      ];
      const values: DTemplateFieldValues = {
         name: "",
         email: "invalid",
         age: "not-number",
      };
      const result = TemplateEngine.validate(fields, values);

      const expectedErrors = {
         name: "Name ist erforderlich",
         email: "Ungültige E-Mail-Adresse",
         age: "Muss eine Zahl sein",
      };
      expect(result.valid).toBe(false);
      expect(result.errors).toEqual(expectedErrors);
   });

   it("handles fields with other types without validation errors", () => {
      const fields: DTemplateField[] = [
         {
            id: "1",
            promptTemplateId: "template1",
            name: "textarea",
            label: "Textarea",
            type: "TEXTAREA",
            required: false,
            order: 1,
         },
         {
            id: "2",
            promptTemplateId: "template1",
            name: "select",
            label: "Select",
            type: "SELECT",
            required: false,
            order: 2,
         },
      ];
      const values: DTemplateFieldValues = {
         textarea: "some text",
         select: "option1",
      };
      const result = TemplateEngine.validate(fields, values);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
   });

   it("validates empty fields array", () => {
      const fields: DTemplateField[] = [];
      const values: DTemplateFieldValues = { name: "John" };
      const result = TemplateEngine.validate(fields, values);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual({});
   });
});

describe("TemplateEngine.extractVariables - tests", () => {
   it("extracts single variable from template", () => {
      const template = "Hello {{name}}!";
      const variables = TemplateEngine.extractVariables(template);
      expect(variables).toEqual(["name"]);
   });

   it("extracts multiple variables from template", () => {
      const template = "{{greeting}} {{name}}, you are {{age}} years old.";
      const variables = TemplateEngine.extractVariables(template);
      expect(variables).toEqual(["greeting", "name", "age"]);
   });

   it("extracts variables with whitespace", () => {
      const template = "{{  name  }} and {{  age  }}";
      const variables = TemplateEngine.extractVariables(template);
      expect(variables).toEqual(["name", "age"]);
   });

   it("returns empty array when no variables present", () => {
      const template = "Hello World!";
      const variables = TemplateEngine.extractVariables(template);
      expect(variables).toEqual([]);
   });

   it("extracts duplicate variables separately", () => {
      const template = "{{name}} and {{name}} are friends";
      const variables = TemplateEngine.extractVariables(template);
      expect(variables).toEqual(["name", "name"]);
   });

   it("handles empty template", () => {
      const template = "";
      const variables = TemplateEngine.extractVariables(template);
      expect(variables).toEqual([]);
   });

   it("extracts variables with underscores", () => {
      const template = "{{first_name}} {{last_name}}";
      const variables = TemplateEngine.extractVariables(template);
      expect(variables).toEqual(["first_name", "last_name"]);
   });

   it("extracts variables with numbers", () => {
      const template = "{{field1}} {{field2}}";
      const variables = TemplateEngine.extractVariables(template);
      expect(variables).toEqual(["field1", "field2"]);
   });

   it("does not extract invalid variable names", () => {
      const template = "{{123invalid}} {{valid}} {{also-invalid}}";
      const variables = TemplateEngine.extractVariables(template);
      expect(variables).toEqual(["valid"]);
   });

   it("handles complex template with text and variables", () => {
      const template = `
            Dear {{name}},

            Your order {{orderId}} has been shipped.
            Total: {{total}}

            Thank you!
         `;
      const variables = TemplateEngine.extractVariables(template);
      expect(variables).toEqual(["name", "orderId", "total"]);
   });
});
