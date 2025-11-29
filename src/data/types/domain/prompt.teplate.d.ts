import z from "zod";

import { createPromptTemplateSchema } from "../validators/prompt.schema";

export type DPromptTemplateCategory = {
   name: string;
};

export type DPromptTemplateCreate = z.infer<typeof createPromptTemplateSchema>;

export type DPromptTemplate = Omit<DPromptTemplateCreate, "categories"> & {
   id: string;
   categories: DPromptTemplateCategory[];
   updatedAt: string;
   createdAt: string;
};
