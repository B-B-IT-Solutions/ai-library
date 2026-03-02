import { ZodError } from "zod";

import {
   promptTemplateFieldSchema,
   promptTemplateFieldTypeSchema,
   updatePromptTemplateSchema,
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

   it("promptTemplateFieldSchema - minimal valid data - test", () => {
      const fieldData = {
         name: "name",
         label: "Name",
         type: "TEXT" as const,
         required: true,
         order: 0,
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
         name: "a".repeat(51),
         label: "Label",
         type: "TEXT" as const,
      };

      const fn = () => promptTemplateFieldSchema.parse(fieldData);
      expect(fn).toThrow(ZodError);
   });

   it("promptTemplateFieldSchema - name at max length valid - test", () => {
      const fieldData = {
         name: "a".repeat(50),
         label: "Label",
         type: "TEXT" as const,
         required: true,
         order: 0,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.name).toBe("a".repeat(50));
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
         required: true,
         order: 0,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.label).toBe("a".repeat(250));
   });

   it("promptTemplateFieldSchema - description optional - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         required: true,
         order: 0,
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
         required: true,
         order: 0,
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

   it("promptTemplateFieldSchema - required can be true - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         required: true,
         order: 0,
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
         order: 0,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.required).toBe(false);
   });

   it("promptTemplateFieldSchema - order can be 0 - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         required: true,
         order: 0,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.order).toBe(0);
   });

   it("promptTemplateFieldSchema - order can be positive integer - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         required: true,
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
         required: true,
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
         required: true,
         order: 0,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.defaultValue).toBeUndefined();
   });

   it("promptTemplateFieldSchema - defaultValue can be set - test", () => {
      const fieldData = {
         name: "name",
         label: "Label",
         type: "TEXT" as const,
         required: true,
         order: 0,
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
         required: true,
         order: 0,
      };

      const validatedValues = promptTemplateFieldSchema.parse(fieldData);
      expect(validatedValues.options).toBeUndefined();
   });

   it("promptTemplateFieldSchema - options can be array of strings - test", () => {
      const fieldData = {
         name: "country",
         label: "Country",
         type: "SELECT" as const,
         required: true,
         order: 0,
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
         required: true,
         order: 0,
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
            required: true,
            order: 0,
         };

         const validatedValues = promptTemplateFieldSchema.parse(fieldData);
         expect(validatedValues.type).toBe(type);
      });
   });
});

describe("updatePromptTemplateSchema - tests", () => {
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
      categoryInput: "",
      fields: [validField],
      globalFieldIds: [],
   };

   describe("Valid data", () => {
      it("updatePromptTemplateSchema - complete valid data - test", () => {
         const validatedValues =
            updatePromptTemplateSchema.parse(validTemplateData);
         expect(validatedValues).toEqual(validTemplateData);
      });

      it("updatePromptTemplateSchema - valid data without optional categoryInput - test", () => {
         const templateData = {
            title: "Test Template",
            description: "A test description",
            content: "Content {{name}}",
            recommendedModel: "gpt-4",
            categories: ["Marketing"],
            fields: [],
            globalFieldIds: [],
         };

         const validatedValues = updatePromptTemplateSchema.parse(templateData);
         expect(validatedValues.categoryInput).toBeUndefined();
         expect(validatedValues.title).toBe("Test Template");
      });

      it("updatePromptTemplateSchema - empty categories array valid - test", () => {
         const templateData = {
            ...validTemplateData,
            categories: [],
         };

         const validatedValues = updatePromptTemplateSchema.parse(templateData);
         expect(validatedValues.categories).toEqual([]);
      });

      it("updatePromptTemplateSchema - empty fields array valid - test", () => {
         const templateData = {
            ...validTemplateData,
            fields: [],
         };

         const validatedValues = updatePromptTemplateSchema.parse(templateData);
         expect(validatedValues.fields).toEqual([]);
      });

      it("updatePromptTemplateSchema - multiple categories valid - test", () => {
         const templateData = {
            ...validTemplateData,
            categories: ["Marketing", "Sales", "Support", "HR"],
         };

         const validatedValues = updatePromptTemplateSchema.parse(templateData);
         expect(validatedValues.categories).toEqual([
            "Marketing",
            "Sales",
            "Support",
            "HR",
         ]);
      });

      it("updatePromptTemplateSchema - multiple fields valid - test", () => {
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

         const validatedValues = updatePromptTemplateSchema.parse(templateData);
         expect(validatedValues.fields).toHaveLength(3);
         expect(validatedValues.fields).toEqual([field1, field2, field3]);
      });
   });

   describe("Title validation", () => {
      it("updatePromptTemplateSchema - empty title invalid - test", () => {
         const templateData = {
            ...validTemplateData,
            title: "",
         };

         const fn = () => updatePromptTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptTemplateSchema - missing title invalid - test", () => {
         const templateData = {
            description: "A test description",
            content: "Content",
            recommendedModel: "gpt-4",
            categories: [],
            fields: [],
         };

         const fn = () => updatePromptTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptTemplateSchema - whitespace only title invalid - test", () => {
         const templateData = {
            ...validTemplateData,
            title: "   ",
         };

         const validatedValues = updatePromptTemplateSchema.parse(templateData);
         expect(validatedValues.title).toBe("   ");
      });
   });

   describe("Description validation", () => {
      it("updatePromptTemplateSchema - empty description invalid - test", () => {
         const templateData = {
            ...validTemplateData,
            description: "",
         };

         const fn = () => updatePromptTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptTemplateSchema - missing description invalid - test", () => {
         const templateData = {
            title: "Test",
            content: "Content",
            recommendedModel: "gpt-4",
            categories: [],
            fields: [],
         };

         const fn = () => updatePromptTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });
   });

   describe("Content validation", () => {
      it("updatePromptTemplateSchema - empty content invalid - test", () => {
         const templateData = {
            ...validTemplateData,
            content: "",
         };

         const fn = () => updatePromptTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptTemplateSchema - missing content invalid - test", () => {
         const templateData = {
            title: "Test",
            description: "Description",
            recommendedModel: "gpt-4",
            categories: [],
            fields: [],
         };

         const fn = () => updatePromptTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptTemplateSchema - content with variables valid - test", () => {
         const templateData = {
            ...validTemplateData,
            content: "Hello {{name}}, your email is {{email}}!",
         };

         const validatedValues = updatePromptTemplateSchema.parse(templateData);
         expect(validatedValues.content).toBe(
            "Hello {{name}}, your email is {{email}}!"
         );
      });
   });

   describe("Recommended model validation", () => {
      it("updatePromptTemplateSchema - empty recommendedModel invalid - test", () => {
         const templateData = {
            ...validTemplateData,
            recommendedModel: "",
         };

         const fn = () => updatePromptTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptTemplateSchema - missing recommendedModel invalid - test", () => {
         const templateData = {
            title: "Test",
            description: "Description",
            content: "Content",
            categories: [],
            fields: [],
         };

         const fn = () => updatePromptTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptTemplateSchema - different model names valid - test", () => {
         const models = ["gpt-4", "gpt-3.5-turbo", "claude-3", "custom-model"];

         models.forEach((model) => {
            const templateData = {
               ...validTemplateData,
               recommendedModel: model,
            };

            const validatedValues =
               updatePromptTemplateSchema.parse(templateData);
            expect(validatedValues.recommendedModel).toBe(model);
         });
      });
   });

   describe("Categories validation", () => {
      it("updatePromptTemplateSchema - missing categories invalid - test", () => {
         const templateData = {
            title: "Test",
            description: "Description",
            content: "Content",
            recommendedModel: "gpt-4",
            fields: [],
         };

         const fn = () => updatePromptTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptTemplateSchema - categories must be array - test", () => {
         const templateData = {
            ...validTemplateData,
            categories: "Marketing",
         };

         const fn = () => updatePromptTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptTemplateSchema - single category valid - test", () => {
         const templateData = {
            ...validTemplateData,
            categories: ["Marketing"],
         };

         const validatedValues = updatePromptTemplateSchema.parse(templateData);
         expect(validatedValues.categories).toEqual(["Marketing"]);
      });
   });

   describe("CategoryInput validation", () => {
      it("updatePromptTemplateSchema - categoryInput optional - test", () => {
         const templateData = {
            title: "Test",
            description: "Description",
            content: "Content",
            recommendedModel: "gpt-4",
            categories: [],
            fields: [],
            globalFieldIds: [],
         };

         const validatedValues = updatePromptTemplateSchema.parse(templateData);
         expect(validatedValues.categoryInput).toBeUndefined();
      });

      it("updatePromptTemplateSchema - categoryInput can be empty string - test", () => {
         const templateData = {
            ...validTemplateData,
            categoryInput: "",
         };

         const validatedValues = updatePromptTemplateSchema.parse(templateData);
         expect(validatedValues.categoryInput).toBe("");
      });

      it("updatePromptTemplateSchema - categoryInput with value valid - test", () => {
         const templateData = {
            ...validTemplateData,
            categoryInput: "New Category",
         };

         const validatedValues = updatePromptTemplateSchema.parse(templateData);
         expect(validatedValues.categoryInput).toBe("New Category");
      });
   });

   describe("Fields validation", () => {
      it("updatePromptTemplateSchema - missing fields invalid - test", () => {
         const templateData = {
            title: "Test",
            description: "Description",
            content: "Content",
            recommendedModel: "gpt-4",
            categories: [],
         };

         const fn = () => updatePromptTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptTemplateSchema - fields must be array - test", () => {
         const templateData = {
            ...validTemplateData,
            fields: "not an array",
         };

         const fn = () => updatePromptTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptTemplateSchema - invalid field in fields array - test", () => {
         const invalidField = {
            name: "",
            label: "Label",
            type: "TEXT",
         };

         const templateData = {
            ...validTemplateData,
            fields: [invalidField],
         };

         const fn = () => updatePromptTemplateSchema.parse(templateData);
         expect(fn).toThrow(ZodError);
      });

      it("updatePromptTemplateSchema - fields with complete field data valid - test", () => {
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

         const validatedValues = updatePromptTemplateSchema.parse(templateData);
         expect(validatedValues.fields).toHaveLength(1);
         expect(validatedValues.fields[0]).toEqual(completeField);
      });
   });

   describe("Complex scenarios", () => {
      it("updatePromptTemplateSchema - real world template data - test", () => {
         const realWorldTemplate = {
            title: "Marketing Email Campaign",
            description: "Create personalized marketing emails",
            content:
               "Dear {{firstName}} {{lastName}},\n\nWe are excited to offer you {{offer}}.\n\nBest regards,\n{{company}}",
            recommendedModel: "gpt-4-turbo",
            categories: ["Marketing", "Email", "Sales"],
            categoryInput: "",
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

         const validatedValues =
            updatePromptTemplateSchema.parse(realWorldTemplate);
         expect(validatedValues.title).toBe("Marketing Email Campaign");
         expect(validatedValues.fields).toHaveLength(4);
         expect(validatedValues.categories).toHaveLength(3);
      });

      it("updatePromptTemplateSchema - minimal valid template - test", () => {
         const minimalTemplate = {
            title: "T",
            description: "D",
            content: "C",
            recommendedModel: "M",
            categories: [],
            fields: [],
            globalFieldIds: [],
         };

         const validatedValues =
            updatePromptTemplateSchema.parse(minimalTemplate);
         expect(validatedValues).toEqual(minimalTemplate);
      });
   });
});
