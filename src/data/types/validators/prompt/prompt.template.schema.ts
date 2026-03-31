import { z } from "zod";

export const promptTemplateFieldTypeSchema = z.enum([
   "TEXT",
   "TEXTAREA",
   "SELECT",
   "CHECKBOX",
   "RADIO",
   "NUMBER",
   "DATE",
   "EMAIL",
]);

export const promptTemplateFieldSchema = z.object({
   name: z.string().min(1, "Name ist erforderlich").max(50).regex(/^\S+$/, {
      message: "Name darf keine Leerzeichen enthalten.",
   }),
   label: z.string().min(1, "Label ist erforderlich").max(250),
   description: z.string().max(500).optional(),
   type: promptTemplateFieldTypeSchema,
   required: z.boolean(),
   defaultValue: z.string().optional(),
   options: z.array(z.string()).optional(),
   order: z.number(),
});

export const updatePromptTemplateSchema = z.object({
   title: z.string().min(1, "Titel ist erforderlich"),
   description: z.string().optional(),
   content: z.string().optional(),
   recommendedModel: z.string().optional(),
   categories: z.array(z.string()),
   fields: z.array(promptTemplateFieldSchema),
   globalFieldIds: z.array(z.string()),
});
