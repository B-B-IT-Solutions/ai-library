import { toLower, trim } from "es-toolkit/compat";
import { z } from "zod";

export const promptVariableTypeSchema = z.enum([
   "TEXT",
   "TEXTAREA",
   "SELECT",
   "CHECKBOX",
   "RADIO",
   "NUMBER",
   "DATE",
   "EMAIL",
]);

export const promptVariableSchema = z.object({
   name: z
      .string()
      .min(1, "Name ist erforderlich")
      .max(50, "Name zu lang (maximal 50 Zeichen)")
      .regex(/^\S+$/, {
         message: "Name darf keine Leerzeichen enthalten.",
      }),
   label: z.string().min(1, "Label ist erforderlich").max(250),
   description: z.string().max(500).optional(),
   type: promptVariableTypeSchema,
   required: z.boolean(),
   defaultValue: z.string().optional(),
   options: z.array(z.string()).optional(),
   order: z.number(),
});

export const categorySchema = z
   .string()
   .trim()
   .min(1, "Kategorie darf nicht leer sein")
   .max(50, `Kategorie zu lang (maximal 50 Zeichen)`);

export const updateTemplateSchema = z.object({
   title: z.string().min(1, "Titel ist erforderlich"),
   description: z.string(),
   content: z.string(),
   recommendedModel: z.string(),
   categories: z
      .array(categorySchema)
      .max(5, `Maximal 5 Kategorien pro Prompt`),
   fields: z.array(promptVariableSchema),
   globalFieldIds: z.array(z.string()),
});

export const renameCategorySchema = z.object({
   name: categorySchema,
});

export const normalizeCategoryName = (value: string) => toLower(trim(value));
