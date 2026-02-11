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
      const emailField = createField("EMAIL", true, "email");
      const fields = [emailField];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({
         email: "test@example.com",
      });

      expect(result.success).toBe(true);
   });

   it("email - valid - optional - test", () => {
      const emailField = createField("EMAIL", false, "email");
      const fields = [emailField];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ email: "test@example.com" });

      expect(result.success).toBe(true);
   });

   it("email - invalid - formt - test", () => {
      const emailField = createField("EMAIL", true, "email");
      const fields = [emailField];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ email: "invalid-email" });
      expect(result.success).toBe(false);
   });

   it("email - invalid - empty - testd", () => {
      const emailField = createField("EMAIL", true, "email");
      const fields = [emailField];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ email: "" });

      expect(result.success).toBe(false);
   });
});

describe("fieldsSchema - number - tests", () => {
   it("number - valid - required - test", () => {
      const numberField = createField("NUMBER", true, "age");
      const fields = [numberField];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ age: 25 });

      expect(result.success).toBe(true);
   });

   it("number - valid - optional - test", () => {
      const numberField = createField("NUMBER", false, "age");
      const fields = [numberField];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ age: 0 });

      expect(result.success).toBe(true);
   });

   it("number - valid - format - test", () => {
      const numberField = createField("NUMBER", true, "age");
      const fields = [numberField];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ age: "42" });

      expect(result.success).toBe(true);
   });

   it("number - invalid - test", () => {
      const numberField = createField("NUMBER", true, "age");
      const fields = [numberField];
      const schema = buildFieldsSchema(fields);

      const result = schema.safeParse({ age: 0 });

      expect(result.success).toBe(false);
   });
});

// describe("buildFieldsSchema - DATE validation", () => {
//    it("should validate correct date - required field", () => {
//       const fields = [createField("DATE", true, "birthdate")];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({ birthdate: "2024-01-15" });

//       expect(result.success).toBe(true);
//       if (result.success) {
//          expect(result.data.birthdate).toBe("2024-01-15");
//       }
//    });

//    it("should reject empty date - required field", () => {
//       const fields = [createField("DATE", true, "birthdate")];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({ birthdate: "" });

//       expect(result.success).toBe(false);
//       if (!result.success) {
//          expect(result.error.errors[0].message).toBe(
//             "Test Field ist erforderlich"
//          );
//       }
//    });

//    it("should validate date - optional field", () => {
//       const fields = [createField("DATE", false, "birthdate")];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({ birthdate: "" });

//       expect(result.success).toBe(true);
//    });
// });

// describe("buildFieldsSchema - CHECKBOX validation", () => {
//    it("should validate checkbox - required field", () => {
//       const fields = [createField("CHECKBOX", true, "agree")];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({ agree: true });

//       expect(result.success).toBe(true);
//       if (result.success) {
//          expect(result.data.agree).toBe(true);
//       }
//    });

//    it("should use default false for checkbox - required field", () => {
//       const fields = [createField("CHECKBOX", true, "agree")];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({});

//       expect(result.success).toBe(true);
//       if (result.success) {
//          expect(result.data.agree).toBe(false);
//       }
//    });

//    it("should validate checkbox - optional field", () => {
//       const fields = [createField("CHECKBOX", false, "newsletter")];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({ newsletter: false });

//       expect(result.success).toBe(true);
//       if (result.success) {
//          expect(result.data.newsletter).toBe(false);
//       }
//    });

//    it("should use default false for checkbox - optional field", () => {
//       const fields = [createField("CHECKBOX", false, "newsletter")];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({});

//       expect(result.success).toBe(true);
//       if (result.success) {
//          expect(result.data.newsletter).toBe(false);
//       }
//    });
// });

// describe("buildFieldsSchema - TEXT/STRING validation", () => {
//    it("should validate text field - required", () => {
//       const fields = [createField("TEXT", true, "name")];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({ name: "John Doe" });

//       expect(result.success).toBe(true);
//       if (result.success) {
//          expect(result.data.name).toBe("John Doe");
//       }
//    });

//    it("should validate empty text field - optional", () => {
//       const fields = [createField("TEXT", false, "name")];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({ name: "" });

//       expect(result.success).toBe(true);
//       if (result.success) {
//          expect(result.data.name).toBe("");
//       }
//    });

//    it("should validate RADIO as string", () => {
//       const fields = [createField("RADIO", false, "choice")];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({ choice: "Option A" });

//       expect(result.success).toBe(true);
//       if (result.success) {
//          expect(result.data.choice).toBe("Option A");
//       }
//    });

//    it("should validate TEXTAREA as string", () => {
//       const fields = [createField("TEXTAREA", false, "description")];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({ description: "Long text here" });

//       expect(result.success).toBe(true);
//       if (result.success) {
//          expect(result.data.description).toBe("Long text here");
//       }
//    });
// });

// describe("buildFieldsSchema - multiple fields", () => {
//    it("should validate schema with multiple fields", () => {
//       const fields = [
//          createField("TEXT", true, "name"),
//          createField("EMAIL", true, "email"),
//          createField("NUMBER", false, "age"),
//          createField("CHECKBOX", false, "newsletter"),
//       ];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({
//          name: "John Doe",
//          email: "john@example.com",
//          age: 30,
//          newsletter: true,
//       });

//       expect(result.success).toBe(true);
//       if (result.success) {
//          expect(result.data).toEqual({
//             name: "John Doe",
//             email: "john@example.com",
//             age: 30,
//             newsletter: true,
//          });
//       }
//    });

//    it("should fail validation when required field is missing", () => {
//       const fields = [
//          createField("TEXT", true, "name"),
//          createField("EMAIL", true, "email"),
//       ];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({
//          name: "John Doe",
//          email: "",
//       });

//       expect(result.success).toBe(false);
//       if (!result.success) {
//          expect(result.error.errors.length).toBeGreaterThan(0);
//          expect(result.error.errors[0].path).toContain("email");
//       }
//    });

//    it("should validate schema with all field types", () => {
//       const fields = [
//          createField("TEXT", false, "username"),
//          createField("EMAIL", false, "email"),
//          createField("NUMBER", false, "age"),
//          createField("DATE", false, "birthdate"),
//          createField("CHECKBOX", false, "terms"),
//          createField("RADIO", false, "gender"),
//          createField("TEXTAREA", false, "bio"),
//       ];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({
//          username: "johndoe",
//          email: "john@example.com",
//          age: "25",
//          birthdate: "2000-01-01",
//          terms: true,
//          gender: "male",
//          bio: "Developer from Berlin",
//       });

//       expect(result.success).toBe(true);
//       if (result.success) {
//          expect(result.data.username).toBe("johndoe");
//          expect(result.data.email).toBe("john@example.com");
//          expect(result.data.age).toBe(25);
//          expect(result.data.birthdate).toBe("2000-01-01");
//          expect(result.data.terms).toBe(true);
//          expect(result.data.gender).toBe("male");
//          expect(result.data.bio).toBe("Developer from Berlin");
//       }
//    });

//    it("should handle empty fields array", () => {
//       const fields: DPromptTemplateField[] = [];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({});

//       expect(result.success).toBe(true);
//       if (result.success) {
//          expect(result.data).toEqual({});
//       }
//    });
// });

// describe("buildFieldsSchema - edge cases", () => {
//    it("should handle fields with same type but different names", () => {
//       const fields = [
//          createField("TEXT", false, "firstName"),
//          createField("TEXT", false, "lastName"),
//          createField("TEXT", false, "middleName"),
//       ];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({
//          firstName: "John",
//          lastName: "Doe",
//          middleName: "Smith",
//       });

//       expect(result.success).toBe(true);
//       if (result.success) {
//          expect(result.data).toEqual({
//             firstName: "John",
//             lastName: "Doe",
//             middleName: "Smith",
//          });
//       }
//    });

//    it("should validate partial data with optional fields", () => {
//       const fields = [
//          createField("TEXT", true, "requiredField"),
//          createField("TEXT", false, "optionalField1"),
//          createField("TEXT", false, "optionalField2"),
//       ];
//       const schema = buildFieldsSchema(fields);

//       const result = schema.safeParse({
//          requiredField: "value",
//       });

//       expect(result.success).toBe(true);
//    });

//    it("should handle number coercion from various inputs", () => {
//       const fields = [createField("NUMBER", false, "count")];
//       const schema = buildFieldsSchema(fields);

//       const testCases = [
//          { input: "123", expected: 123 },
//          { input: 456, expected: 456 },
//          { input: "0", expected: 0 },
//          { input: "-10", expected: -10 },
//       ];

//       testCases.forEach(({ input, expected }) => {
//          const result = schema.safeParse({ count: input });
//          expect(result.success).toBe(true);
//          if (result.success) {
//             expect(result.data.count).toBe(expected);
//          }
//       });
//    });
// });
