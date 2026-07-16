import z from "zod";

import { DPromptVariableType } from "@/data/types/domain/prompt";
import { globalPromptFieldSchema } from "@/data/types/validators/settings";

export type DSettingsSection =
   | "general"
   | "account"
   | "subscription"
   | "global-template-fields"
   | "prompt-categories"
   | "prompt-models";

export type DGlobalPromptFieldUpdate = z.infer<typeof globalPromptFieldSchema>;

export type DGlobalPromptField = {
   id: string;
   userId: string;
   name: string;
   label: string;
   description: string | null;
   type: DPromptVariableType;
   required: boolean;
   defaultValue: string | null;
   options?: string[];
   order: number;
   createdAt: string;
   updatedAt: string;
};
