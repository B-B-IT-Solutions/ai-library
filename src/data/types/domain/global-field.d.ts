import z from "zod";

import { globalFieldSchema } from "@/data/types/validators/settings";

import { DPromptTemplateFieldType } from "./prompt.template";

export type DGlobalFieldUpdate = z.infer<typeof globalFieldSchema>;

export type DGlobalField = {
   id: string;
   userId: string;
   name: string;
   label: string;
   description: string | null;
   type: DPromptTemplateFieldType;
   required: boolean;
   defaultValue: string | null;
   options: string[] | null;
   order: number;
   createdAt: string;
   updatedAt: string;
};
