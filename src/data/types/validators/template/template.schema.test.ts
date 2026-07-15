import { ZodError } from "zod";

import {
   categorySchema,
   promptVariableSchema,
   promptVariableTypeSchema,
   updateTemplateSchema,
} from "./template.schema";

describe("templateFieldTypeSchema - tests", () => {
   it("TEXT type valid - test", () => {
      const validatedValue = promptVariableTypeSchema.parse("TEXT");
      expect(validatedValue).toBe("TEXT");
   });

   it("TEXTAREA type valid - test", () => {
      const validatedValue = promptVariableTypeSchema.parse("TEXTAREA");
      expect(validatedValue).toBe("TEXTAREA");
   });

   it("SELECT type valid - test", () => {
      const validatedValue = promptVariableTypeSchema.parse("SELECT");
      expect(validatedValue).toBe("SELECT");
   });

   it("CHECKBOX type valid - test", () => {
      const validatedValue = promptVariableTypeSchema.parse("CHECKBOX");
      expect(validatedValue).toBe("CHECKBOX");
   });

   it("RADIO type valid - test", () => {
      const validatedValue = promptVariableTypeSchema.parse("RADIO");
      expect(validatedValue).toBe("RADIO");
   });

   it("NUMBER type valid - test", () => {
      const validatedValue = promptVariableTypeSchema.parse("NUMBER");
      expect(validatedValue).toBe("NUMBER");
   });

   it("DATE type valid - test", () => {
      const validatedValue = promptVariableTypeSchema.parse("DATE");
      expect(validatedValue).toBe("DATE");
   });

   it("EMAIL type valid - test", () => {
      const validatedValue = promptVariableTypeSchema.parse("EMAIL");
      expect(validatedValue).toBe("EMAIL");
   });

   it("invalid type - test", () => {
      const fn = () => promptVariableTypeSchema.parse("INVALID_TYPE");
      expect(fn).toThrow(ZodError);
   });

   it("empty string - test", () => {
      const fn = () => promptVariableTypeSchema.parse("");
      expect(fn).toThrow(ZodError);
   });
});

describe("promptVariableSchema - tests", () => {
   it("complete valid data - test", () => {
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

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues).toEqual(fieldData);
   });

   it("minimal valid data - test", () => {
      const fieldData = {
         name: "name",
         label: "Name",
         type: "TEXT" as const,
         required: true,
         order: 0,
      };

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues).toEqual({
         name: "name",
         label: "Name",
         type: "TEXT",
         required: true,
         order: 0,
      });
   });

   it("name empty string invalid - test", () => {
      const fieldData = {
         name: "",
         label: "Label",
         type: "TEXT" as const,
      };

      const fn = () => promptVariableSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("name exceeds max length - test", () => {
      const fieldData = {
         name: "a".repeat(51),
         label: "Label",
         type: "TEXT" as const,
      };

      const fn = () => promptVariableSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("name at max length valid - test", () => {
      const fieldData = {
         name: "a".repeat(50),
         label: "Label",
         type: "TEXT" as const,
         required: true,
         order: 0,
      };

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues.name).toBe("a".repeat(50));
   });

   it("label empty string invalid - test", () => {
      const fieldData = {
         name: "name",
         label: "",
         type: "TEXT" as const,
      };

      const fn = () => promptVariableSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("label exceeds max length - test", () => {
      const fieldData = {
         name: "name",
         label: "a".repeat(251),
         type: "TEXT" as const,
      };

      const fn = () => promptVariableSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("label at max length valid - test", () => {
      const fieldData = {
         name: "name",
         label: "a".repeat(250),
         type: "TEXT" as const,
         required: true,
         order: 0,
      };

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues.label).toBe("a".repeat(250));
   });

   it("description optional - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         required: true,
         order: 0,
      };

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues.description).toBeUndefined();
   });

   it("description exceeds max length - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         description: "a".repeat(501),
         type: "TEXT" as const,
      };

      const fn = () => promptVariableSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("description at max length valid - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         description: "a".repeat(500),
         type: "TEXT" as const,
         required: true,
         order: 0,
      };

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues.description).toBe("a".repeat(500));
   });

   it("invalid type - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "INVALID",
      };

      const fn = () => promptVariableSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("required can be true - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         required: true,
         order: 0,
      };

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues.required).toBe(true);
   });

   it("required can be false - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         required: false,
         order: 0,
      };

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues.required).toBe(false);
   });

   it("order can be 0 - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         required: true,
         order: 0,
      };

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues.order).toBe(0);
   });

   it("order can be positive integer - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         required: true,
         order: 5,
      };

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues.order).toBe(5);
   });

   it("order can be negative integer - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         required: true,
         order: -1,
      };

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues.order).toBe(-1);
   });

   it("order must be integer - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         order: 1.5,
      };

      const fn = () => promptVariableSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("defaultValue optional - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         required: true,
         order: 0,
      };

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues.defaultValue).toBeUndefined();
   });

   it("defaultValue can be set - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         required: true,
         order: 0,
         defaultValue: "Default text",
      };

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues.defaultValue).toBe("Default text");
   });

   it("options optional - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "SELECT" as const,
         required: true,
         order: 0,
      };

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues.options).toBeUndefined();
   });

   it("options can be array of strings - test", () => {
      const fieldData = {
         name: "country",
         label: "Country",
         type: "SELECT" as const,
         required: true,
         order: 0,
         options: ["USA", "UK", "Germany"],
      };

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues.options).toEqual(["USA", "UK", "Germany"]);
   });

   it("options can be empty array - test", () => {
      const fieldData = {
         name: "country",
         label: "Country",
         type: "SELECT" as const,
         required: true,
         order: 0,
         options: [],
      };

      const validatedValues = promptVariableSchema.parse(fieldData);
      expect(validatedValues.options).toEqual([]);
   });

   it("missing name invalid - test", () => {
      const fieldData = {
         label: "Label",
         type: "TEXT" as const,
      };

      const fn = () => promptVariableSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("missing label invalid - test", () => {
      const fieldData = {
         name: "name",
         type: "TEXT" as const,
      };

      const fn = () => promptVariableSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("missing type invalid - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
      };

      const fn = () => promptVariableSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("all field types valid - test", () => {
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
            required: true,
            order: 0,
         };

         const validatedValues = promptVariableSchema.parse(fieldData);
         expect(validatedValues.type).toBe(type);
      });
   });
});

describe("categorySchema - tests", () => {
   it("valid category - test", () => {
      const validatedValue = categorySchema.parse("Marketing");
      expect(validatedValue).toBe("Marketing");
   });

   it("trims leading and trailing whitespace - test", () => {
      const validatedValue = categorySchema.parse("  Marketing  ");
      expect(validatedValue).toBe("Marketing");
   });

   it("single character valid - test", () => {
      const validatedValue = categorySchema.parse("A");
      expect(validatedValue).toBe("A");
   });

   it("empty string invalid - test", () => {
      const result = categorySchema.safeParse("");
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
         "Kategorie darf nicht leer sein"
      );
   });

   it("whitespace only string invalid - test", () => {
      const result = categorySchema.safeParse("   ");
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
         "Kategorie darf nicht leer sein"
      );
   });

   it("at max length (50 chars) valid - test", () => {
      const validatedValue = categorySchema.parse("a".repeat(50));
      expect(validatedValue).toBe("a".repeat(50));
   });

   it("exceeds max length (51 chars) invalid - test", () => {
      const result = categorySchema.safeParse("a".repeat(51));
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toBe(
         "Kategorie zu lang (maximal 50 Zeichen)"
      );
   });

   it("length check applies after trimming - test", () => {
      const paddedValue = ` ${"a".repeat(50)} `;
      const validatedValue = categorySchema.parse(paddedValue);
      expect(validatedValue).toBe("a".repeat(50));
   });

   it("non-string value invalid - test", () => {
      const fn = () => categorySchema.parse(123);
      expect(fn).toThrow(ZodError);
   });
});

describe("updateTemplateSchema - tests", () => {
   const validField = {
      name: "email",
      label: "Email Address",
      type: "EMAIL" as const,
      required: true,
      order: 0,
   };

   const validTemplateData = {
      title: "Test Template",
      description: "A test template description",
      content: "Hello {{email}}, welcome to {{company}}!",
      recommendedModel: "gpt-4",
      categories: ["Marketing", "Sales"],
      fields: [validField],
      globalFieldIds: [],
   };

   describe("Valid data", () => {
      it("complete valid data - test", () => {
         const validatedValues = updateTemplateSchema.parse(validTemplateData);
         expect(validatedValues).toEqual(validTemplateData);
      });

      it("empty categories array valid - test", () => {
         const templateData = {
            ...validTemplateData,
            categories: [],
         };

         const validatedValues = updateTemplateSchema.parse(templateData);
         expect(validatedValues.categories).toEqual([]);
      });

      it("empty fields array valid - test", () => {
         const templateData = {
            ...validTemplateData,
            fields: [],
         };

         const validatedValues = updateTemplateSchema.parse(templateData);
         expect(validatedValues.fields).toEqual([]);
      });

      it("multiple categories valid - test", () => {
         const templateData = {
            ...validTemplateData,
            categories: ["Marketing", "Sales", "Support", "HR"],
         };

         const validatedValues = updateTemplateSchema.parse(templateData);
         expect(validatedValues.categories).toEqual([
            "Marketing",
            "Sales",
            "Support",
            "HR",
         ]);
      });

      it("multiple fields valid - test", () => {
         const field1 = {
            name: "email",
            label: "Email",
            type: "EMAIL" as const,
            required: true,
            order: 0,
         };
         const field2 = {
            name: "name",
            label: "Name",
            type: "TEXT" as const,
            required: true,
            order: 1,
         };
         const field3 = {
            name: "age",
            label: "Age",
            type: "NUMBER" as const,
            required: false,
            order: 2,
         };

         const templateData = {
            ...validTemplateData,
            fields: [field1, field2, field3],
         };

         const validatedValues = updateTemplateSchema.parse(templateData);
         expect(validatedValues.fields).toHaveLength(3);
         expect(validatedValues.fields).toEqual([field1, field2, field3]);
      });
   });

   describe("Title validation", () => {
      it("empty title invalid - test", () => {
         const templateData = {
            ...validTemplateData,
            title: "",
         };

         const fn = () => updateTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("missing title invalid - test", () => {
         const templateData = {
            description: "A test description",
            content: "Content",
            recommendedModel: "gpt-4",
            categories: [],
            fields: [],
         };

         const fn = () => updateTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("whitespace only title invalid - test", () => {
         const templateData = {
            ...validTemplateData,
            title: "   ",
         };

         const validatedValues = updateTemplateSchema.parse(templateData);
         expect(validatedValues.title).toBe("   ");
      });
   });

   describe("Description validation", () => {
      it("empty description valid - test", () => {
         const templateData = {
            ...validTemplateData,
            description: "",
         };

         const validatedValues = updateTemplateSchema.parse(templateData);
         expect(validatedValues).toEqual(templateData);
      });

      it("missing description invalid - test", () => {
         const templateData = {
            title: "Test",
            content: "Content",
            recommendedModel: "gpt-4",
            categories: [],
            fields: [],
         };

         const fn = () => updateTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });
   });

   describe("Content validation", () => {
      it("empty content valid - test", () => {
         const templateData = {
            ...validTemplateData,
            content: "",
         };

         const validatedValues = updateTemplateSchema.parse(templateData);
         expect(validatedValues).toEqual(templateData);
      });

      it("missing content invalid - test", () => {
         const templateData = {
            title: "Test",
            description: "Description",
            recommendedModel: "gpt-4",
            categories: [],
            fields: [],
         };

         const fn = () => updateTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("content with variables valid - test", () => {
         const templateData = {
            ...validTemplateData,
            content: "Hello {{name}}, your email is {{email}}!",
         };

         const validatedValues = updateTemplateSchema.parse(templateData);
         expect(validatedValues.content).toBe(
            "Hello {{name}}, your email is {{email}}!"
         );
      });
   });

   describe("Recommended model validation", () => {
      it("empty recommendedModel valid - test", () => {
         const templateData = {
            ...validTemplateData,
            recommendedModel: "",
         };

         const validatedValues = updateTemplateSchema.parse(templateData);
         expect(validatedValues).toEqual(templateData);
      });

      it("missing recommendedModel invalid - test", () => {
         const templateData = {
            title: "Test",
            description: "Description",
            content: "Content",
            categories: [],
            fields: [],
         };

         const fn = () => updateTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("different model names valid - test", () => {
         const models = ["gpt-4", "gpt-3.5-turbo", "claude-3", "custom-model"];

         models.forEach((model) => {
            const templateData = {
               ...validTemplateData,
               recommendedModel: model,
            };

            const validatedValues = updateTemplateSchema.parse(templateData);
            expect(validatedValues.recommendedModel).toBe(model);
         });
      });
   });

   describe("Categories validation", () => {
      it("missing categories invalid - test", () => {
         const templateData = {
            title: "Test",
            description: "Description",
            content: "Content",
            recommendedModel: "gpt-4",
            fields: [],
         };

         const fn = () => updateTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("categories must be array - test", () => {
         const templateData = {
            ...validTemplateData,
            categories: "Marketing",
         };

         const fn = () => updateTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("single category valid - test", () => {
         const templateData = {
            ...validTemplateData,
            categories: ["Marketing"],
         };

         const validatedValues = updateTemplateSchema.parse(templateData);
         expect(validatedValues.categories).toEqual(["Marketing"]);
      });

      it("exactly 5 categories valid - test", () => {
         const templateData = {
            ...validTemplateData,
            categories: ["A", "B", "C", "D", "E"],
         };

         const validatedValues = updateTemplateSchema.parse(templateData);
         expect(validatedValues.categories).toHaveLength(5);
      });

      it("more than 5 categories invalid - test", () => {
         const templateData = {
            ...validTemplateData,
            categories: ["A", "B", "C", "D", "E", "F"],
         };

         const result = updateTemplateSchema.safeParse(templateData);
         expect(result.success).toBe(false);
         expect(result.error?.issues[0].message).toBe(
            "Maximal 5 Kategorien pro Prompt"
         );
      });

      it("category exceeding max length invalid - test", () => {
         const templateData = {
            ...validTemplateData,
            categories: ["a".repeat(51)],
         };

         const result = updateTemplateSchema.safeParse(templateData);
         expect(result.success).toBe(false);
         expect(result.error?.issues[0].message).toBe(
            "Kategorie zu lang (maximal 50 Zeichen)"
         );
      });

      it("empty string category invalid - test", () => {
         const templateData = {
            ...validTemplateData,
            categories: [""],
         };

         const result = updateTemplateSchema.safeParse(templateData);
         expect(result.success).toBe(false);
         expect(result.error?.issues[0].message).toBe(
            "Kategorie darf nicht leer sein"
         );
      });

      it("category values are trimmed - test", () => {
         const templateData = {
            ...validTemplateData,
            categories: ["  Marketing  ", "Sales "],
         };

         const validatedValues = updateTemplateSchema.parse(templateData);
         expect(validatedValues.categories).toEqual(["Marketing", "Sales"]);
      });

      it("duplicate categories are not deduplicated by the schema - test", () => {
         const templateData = {
            ...validTemplateData,
            categories: ["Marketing", "Marketing"],
         };

         const validatedValues = updateTemplateSchema.parse(templateData);
         expect(validatedValues.categories).toEqual([
            "Marketing",
            "Marketing",
         ]);
      });
   });

   describe("Fields validation", () => {
      it("missing fields invalid - test", () => {
         const templateData = {
            title: "Test",
            description: "Description",
            content: "Content",
            recommendedModel: "gpt-4",
            categories: [],
         };

         const fn = () => updateTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("fields must be array - test", () => {
         const templateData = {
            ...validTemplateData,
            fields: "not an array",
         };

         const fn = () => updateTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("invalid field in fields array - test", () => {
         const invalidField = {
            name: "",
            label: "Label",
            type: "TEXT",
         };

         const templateData = {
            ...validTemplateData,
            fields: [invalidField],
         };

         const fn = () => updateTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("fields with complete field data valid - test", () => {
         const completeField = {
            name: "email",
            label: "Email Address",
            description: "Enter your email",
            type: "EMAIL" as const,
            required: true,
            order: 1,
            defaultValue: "user@example.com",
            options: [],
         };

         const templateData = {
            ...validTemplateData,
            fields: [completeField],
         };

         const validatedValues = updateTemplateSchema.parse(templateData);
         expect(validatedValues.fields).toHaveLength(1);
         expect(validatedValues.fields[0]).toEqual(completeField);
      });
   });

   describe("Complex scenarios", () => {
      it("real world template data - test", () => {
         const realWorldTemplate = {
            title: "Marketing Email Campaign",
            description: "Create personalized marketing emails",
            content:
               "Dear {{firstName}} {{lastName}},\n\nWe are excited to offer you {{offer}}.\n\nBest regards,\n{{company}}",
            recommendedModel: "gpt-4-turbo",
            categories: ["Marketing", "Email", "Sales"],
            globalFieldIds: [],
            fields: [
               {
                  name: "firstName",
                  label: "First Name",
                  type: "TEXT" as const,
                  required: true,
                  order: 0,
               },
               {
                  name: "lastName",
                  label: "Last Name",
                  type: "TEXT" as const,
                  required: true,
                  order: 1,
               },
               {
                  name: "offer",
                  label: "Offer Description",
                  type: "TEXTAREA" as const,
                  required: true,
                  order: 2,
               },
               {
                  name: "company",
                  label: "Company Name",
                  type: "TEXT" as const,
                  required: false,
                  order: 3,
                  defaultValue: "Your Company",
               },
            ],
         };

         const validatedValues = updateTemplateSchema.parse(realWorldTemplate);
         expect(validatedValues.title).toBe("Marketing Email Campaign");
         expect(validatedValues.fields).toHaveLength(4);
         expect(validatedValues.categories).toHaveLength(3);
      });

      it("minimal valid template - test", () => {
         const minimalTemplate = {
            title: "T",
            description: "D",
            content: "C",
            recommendedModel: "M",
            categories: [],
            fields: [],
            globalFieldIds: [],
         };

         const validatedValues = updateTemplateSchema.parse(minimalTemplate);
         expect(validatedValues).toEqual(minimalTemplate);
      });
   });
});
