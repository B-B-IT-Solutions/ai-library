import z from "zod";

import { createPromptSchema } from "../validators/prompt.schema";

export type DPromptTemplate = z.infer<typeof insertPromptTemplateSchema> & {
   id: string;
   updatedAt: string;
   createdAt: string;
};

export type DPromptCreate = z.infer<typeof createPromptSchema>;

export type DPrompt = DPromptCreate & {
   id: string;
   currentVersion: number;
   versions: DPromptVersion[];
   isFavorite: boolean;
   updatedAt: string;
   createdAt: string;
};

export type DPromptVersion = {
   version: number;
   content: string;
   createdAt: string;
};

export type DPromptUdapte = {
   id: stirng;
   title: stirng;
   content: string;
   categories: string[];
   recommendedModel: string;
   followUpPrompts: string[];
};
