import { z } from "zod";

import { promptTemplateFieldTypeSchema } from "@/data/types/validators/template";

export const globalTemplateFieldSchema = z.object({
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
