import z from "zod";

export const updatePromptSchema = z.object({
   title: z.string().min(3, "Titel ist erforderlich"),
   content: z.string(),
   categories: z.array(z.string()),
   categoryInput: z.string().optional(),
   recommendedModel: z.string(),
   followUpPrompts: z.array(z.string()),
});
