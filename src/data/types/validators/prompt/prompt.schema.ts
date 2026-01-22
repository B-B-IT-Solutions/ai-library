import z from "zod";

export const createPromptSchema = z.object({
   title: z.string().min(3, "Title must be at least 3 characters"),
   content: z.string().min(1, "Content is required"),
   categories: z.array(z.string()),
   recommendedModel: z
      .string()
      .min(3, "Recommended model must be at least 3 characters"),
   followUpPrompts: z.array(z.string()).optional().default([]),
});

export const updatePromptSchema = z.object({
   id: z.string().optional(),
   title: z.string().min(3, "Titel ist erforderlich"),
   content: z.string(),
   categories: z.array(z.string()),
   recommendedModel: z.string(),
   followUpPrompts: z.array(z.string()),
});

export const deletePromptSchema = z.object({
   id: z.string().uuid(),
});

export const toggleFavoriteSchema = z.object({
   id: z.string().uuid(),
   isFavorite: z.boolean(),
});

export const createPromptTemplateSchema = z.object({
   title: z.string().min(3, "Title must be at least 3 characters"),
   content: z.string().min(3, "Content must be at least 3 characters"),
   categories: z.array(z.string()),
   recommendedModel: z
      .string()
      .min(3, "Recommended model must be at least 3 characters"),
});
