import z from "zod";

import { createPromptTemplateSchema } from "@/data/types/validators/prompt.schema";

export type DPromptTemplateCategory = {
   name: string;
};

export type DPromptTemplateCreate = z.infer<typeof createPromptTemplateSchema>;

export type DPromptTemplateDescriptor = {
   id: string;
   title: string;
   recommendedModel: string;
   categories: DPromptTemplateCategory[];
   updatedAt: string;
   createdAt: string;
};
