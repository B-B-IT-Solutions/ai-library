import { z } from "zod";

import { promptTemplateFieldTypeSchema } from "@/data/types/validators/prompt";

export const globalFieldSchema = z.object({
   name: z.string().min(1, "Feldname ist erforderlich").max(100),
   label: z.string().min(1, "Label ist erforderlich").max(250),
   description: z.string().max(500).optional(),
   type: promptTemplateFieldTypeSchema,
   required: z.boolean(),
   defaultValue: z.string().optional(),
   options: z.array(z.string()).optional(),
   order: z.number(),
});
