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
   name: z.string().min(1).max(100),
   label: z.string().min(1).max(250),
   description: z.string().max(500).optional(),
   type: promptTemplateFieldTypeSchema,
   required: z.boolean().default(true),
   order: z.number().int().default(0),
   defaultValue: z.string().optional(),
   options: z.array(z.string()).optional(),
});

export const templateFieldValuesSchema = z.record(z.string(), z.any());
