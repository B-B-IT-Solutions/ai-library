import z from "zod";

import {
   DPromptTemplateField,
   DPromptTemplateFieldType,
} from "@/data/types/domain/prompt.template";

import { buildFieldsSchema } from "./fields.schema";

const createField = (
   type: DPromptTemplateFieldType,
   required = false,
   name = "testField"
): DPromptTemplateField => ({
   id: "1",
   promptTemplateId: "1",
   name,
   label: "Test Field",
   type,
   required,
   order: 1,
   defaultValue: null,
   description: null,
});

describe("fieldsSchema - email - tests", () => {
   it("email - valid - required - test", () => {
      const field = createField("EMAIL", true, "email");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({
         email: "test@example.com",
      });

      expect(result.success).toBe(true);
   });

   it("email - valid - optional - test", () => {
      const field = createField("EMAIL", false, "email");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ email: "test@example.com" });

      expect(result.success).toBe(true);
   });

   it("email - invalid - formt - test", () => {
      const field = createField("EMAIL", true, "email");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ email: "invalid-email" });
      expect(result.success).toBe(false);
   });

   it("email - invalid - empty - testd", () => {
      const field = createField("EMAIL", true, "email");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ email: "" });

      expect(result.success).toBe(false);
   });
});

describe("fieldsSchema - number - tests", () => {
   it("number - valid - required - test", () => {
      const field = createField("NUMBER", true, "age");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ age: 25 });

      expect(result.success).toBe(true);
   });

   it("number - valid - optional - test", () => {
      const field = createField("NUMBER", false, "age");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ age: 0 });

      expect(result.success).toBe(true);
   });

   it("number - valid - format - test", () => {
      const field = createField("NUMBER", true, "age");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ age: "42" });

      expect(result.success).toBe(true);
   });

   it("number - invalid - test", () => {
      const field = createField("NUMBER", true, "age");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ age: 0 });

      expect(result.success).toBe(false);
   });
});

describe("fieldsSchema - date - tests", () => {
   it("date - valid - required - test", () => {
      const field = createField("DATE", true, "birthdate");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ birthdate: "2024-01-15" });

      expect(result.success).toBe(true);
   });

   it("date - valid - optional - test", () => {
      const field = createField("DATE", false, "birthdate");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ birthdate: "" });

      expect(result.success).toBe(true);
   });

   it("date - invalid - empty - test", () => {
      const field = createField("DATE", true, "birthdate");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ birthdate: "" });

      expect(result.success).toBe(false);
   });
});

describe("fieldsSchema - checkbox - tests", () => {
   it("checkbox - valid - required - test", () => {
      const field = createField("CHECKBOX", true, "newsletter");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ newsletter: true });

      expect(result.success).toBe(true);
      if (result.success) {
         expect(result.data.newsletter).toBe(true);
      }
   });

   it("checkbox - valid - default false - test", () => {
      const field = createField("CHECKBOX", true, "newsletter");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
         expect(result.data.newsletter).toBe(false);
      }
   });

   it("checkbox - valid - optional 1 - test", () => {
      const field = createField("CHECKBOX", false, "newsletter");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ newsletter: false });

      expect(result.success).toBe(true);
      if (result.success) {
         expect(result.data.newsletter).toBe(false);
      }
   });

   it("checkbox - valid - optional 2 - test", () => {
      const field = createField("CHECKBOX", false, "newsletter");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
         expect(result.data.newsletter).toBe(false);
      }
   });
});

describe("fieldsSchema - text - tests", () => {
   it("text - valid - required - test", () => {
      const field = createField("TEXT", true, "name");
      const fields = [field];

      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ name: "John Doe" });

      expect(result.success).toBe(true);
      if (result.success) {
         expect(result.data.name).toBe("John Doe");
      }
   });

   it("text - valid - optional - test", () => {
      const field = createField("TEXT", false, "name");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ name: "" });

      expect(result.success).toBe(true);
      if (result.success) {
         expect(result.data.name).toBe("");
      }
   });

   it("textarea - valid - optional - test", () => {
      const field = createField("TEXTAREA", false, "description");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ description: "Long text here" });

      expect(result.success).toBe(true);
      if (result.success) {
         expect(result.data.description).toBe("Long text here");
      }
   });

   it("text - invalid - empty - required - test", () => {
      const field = createField("TEXT", true, "name");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ name: "" });

      expect(result.success).toBe(false);
      if (!result.success) {
         expect(result.error.issues[0].message).toBe("Test Field ist erforderlich");
      }
   });

   it("textarea - valid - required - test", () => {
      const field = createField("TEXTAREA", true, "description");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ description: "Long text here" });

      expect(result.success).toBe(true);
   });

   it("textarea - invalid - empty - required - test", () => {
      const field = createField("TEXTAREA", true, "description");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ description: "" });

      expect(result.success).toBe(false);
      if (!result.success) {
         expect(result.error.issues[0].message).toBe("Test Field ist erforderlich");
      }
   });

   it("select - valid - required - test", () => {
      const field = createField("SELECT", true, "country");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ country: "DE" });

      expect(result.success).toBe(true);
   });

   it("select - valid - optional - test", () => {
      const field = createField("SELECT", false, "country");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ country: "" });

      expect(result.success).toBe(true);
   });

   it("select - invalid - empty - required - test", () => {
      const field = createField("SELECT", true, "country");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ country: "" });

      expect(result.success).toBe(false);
      if (!result.success) {
         expect(result.error.issues[0].message).toBe("Test Field ist erforderlich");
      }
   });

   it("radio - valid - optional - test", () => {
      const field = createField("RADIO", false, "choice");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ choice: "Option A" });

      expect(result.success).toBe(true);
      if (result.success) {
         expect(result.data.choice).toBe("Option A");
      }
   });

   it("radio - valid - required - test", () => {
      const field = createField("RADIO", true, "choice");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ choice: "Option A" });

      expect(result.success).toBe(true);
   });

   it("radio - invalid - empty - required - test", () => {
      const field = createField("RADIO", true, "choice");
      const fields = [field];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ choice: "" });

      expect(result.success).toBe(false);
      if (!result.success) {
         expect(result.error.issues[0].message).toBe("Test Field ist erforderlich");
      }
   });
});
