import z from "zod";

import { DPromptFieldType } from "@/data/types/domain/prompt";
import { globalPromptFieldSchema } from "@/data/types/validators/settings";

export type DSettingsSection =
   | "general"
   | "account"
   | "subscription"
   | "global-template-fields";

export type DGlobalPromptFieldUpdate = z.infer<typeof globalPromptFieldSchema>;

export type DGlobalPromptField = {
   id: string;
   userId: string;
   name: string;
   label: string;
   description: string | null;
   type: DPromptFieldType;
   required: boolean;
   defaultValue: string | null;
   options?: string[];
   order: number;
   createdAt: string;
   updatedAt: string;
};
