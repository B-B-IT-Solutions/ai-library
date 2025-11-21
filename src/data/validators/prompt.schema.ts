import z from "zod";

export const createPromptSchema = z.object({
   title: z.string().min(3, "Title must be at least 3 characters"),
   content: z.string(),
   categories: z.array(z.string()),
   recommendedModel: z
      .string()
      .min(3, "Recommended model must be at least 3 characters"),
   followUpPrompts: z.array(z.string()),
});

export const createPromptTemplateSchema = z.object({
   title: z.string().min(3, "Title must be at least 3 characters"),
   content: z.string().min(3, "Content must be at least 3 characters"),
   categories: z.array(z.string()),
   recommendedModel: z
      .string()
      .min(3, "Recommended model must be at least 3 characters"),
   followUpPrompts: z.array(z.string()),
});
