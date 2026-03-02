import z from "zod";

import { DPromptTemplateFieldType } from "@/data/types/domain/prompt.template";
import { globalTemplateFieldSchema } from "@/data/types/validators/settings";

export type DSettingsSection =
   | "general"
   | "account"
   | "subscription"
   | "global-template-fields";

export type DGlobalTemplateFieldUpdate = z.infer<
   typeof globalTemplateFieldSchema
>;

export type DGlobalTemplateField = {
   id: string;
   userId: string;
   name: string;
   label: string;
   description: string | null;
   type: DPromptTemplateFieldType;
   required: boolean;
   defaultValue: string | null;
   options?: string[];
   order: number;
   createdAt: string;
   updatedAt: string;
};
