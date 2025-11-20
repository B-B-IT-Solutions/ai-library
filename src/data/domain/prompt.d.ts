import z from "zod";

import { insertPromptSchema } from "../validators/prompt.schema";

export type DPromptTemplate = {
   title: stirng;
   content: string;
   categories: string[];
   recommendedModel: string;
   followUpPrompts: [];
};

export type DPrompt = z.infer<typeof insertPromptSchema> & {
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
   createdAt: Date;
};

export type DPromptUdapte = {
   id: stirng;
   title: stirng;
   content: string;
   categories: string[];
   recommendedModel: string;
   followUpPrompts: string[];
};
