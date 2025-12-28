"use server";

import { validate as isValidUuid } from "uuid";

import {
   pCheckUserHasTemplate,
   pGetLibraryEntries,
} from "@/data/db/queries/library";
import { createPrompt as pCreatePrompt } from "@/data/db/queries/prompt";
import { DLibraryEntry } from "@/data/types/domain/library";
import { ActionResult } from "@/data/types/utils";
import { PromptCreateInput } from "@/generated/prisma/models";
import { requireUser } from "../auth-utils";
import { formatError } from "../utils";

import { toDLibraryEntries } from "./library.mapper";

export const getLibraryEntries = async (): Promise<DLibraryEntry[]> => {
   try {
      const user = await requireUser();
      const entries = await pGetLibraryEntries(user.id!);
      return toDLibraryEntries(entries);
   } catch {
      return [];
   }
};

export const hasAccessToTemplate = async (
   templateId: string
): Promise<boolean> => {
   try {
      const user = await requireUser();
      return await pCheckUserHasTemplate(user.id, templateId);
   } catch {
      return false;
   }
};

export const copyTemplateToPrompts = async (
   templateId: string
): Promise<ActionResult<void>> => {
   try {
      if (!isValidUuid(templateId)) {
         return {
            success: false,
            message: "Invalid template ID.",
         };
      }

      const user = await requireUser();

      // Check access
      const hasAccess = await hasAccessToTemplate(templateId);
      if (!hasAccess) {
         return {
            success: false,
            message: "You do not have access to this template.",
         };
      }

      // Get template
      const purchases = await pGetLibraryEntries(user.id);
      const purchase = purchases.find((p) => p.templateId === templateId);

      if (!purchase) {
         return {
            success: false,
            message: "Template not found.",
         };
      }

      const template = purchase.template;

      // Create prompt from template
      const promptData: PromptCreateInput = {
         title: template.title,
         content: template.content,
         recommendedModel: template.recommendedModel,
         followUpPrompts: [],
         currentVersion: 1,
         isFavorite: false,
         categories: {
            connectOrCreate: template.categories.map((cat) => ({
               where: { name: cat.name },
               create: { name: cat.name },
            })),
         },
      };

      await pCreatePrompt(promptData);

      return {
         success: true,
         message: "Template copied to your prompts successfully!",
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const downloadTemplate = async (
   templateId: string
): Promise<ActionResult<string>> => {
   try {
      if (!isValidUuid(templateId)) {
         return {
            success: false,
            message: "Invalid template ID.",
         };
      }

      const user = await requireUser();

      // Check access
      const hasAccess = await hasAccessToTemplate(templateId);
      if (!hasAccess) {
         return {
            success: false,
            message: "You do not have access to this template.",
         };
      }

      // Get template
      const purchases = await pGetLibraryEntries(user.id);
      const purchase = purchases.find((p) => p.templateId === templateId);

      if (!purchase) {
         return {
            success: false,
            message: "Template not found.",
         };
      }

      const template = purchase.template;

      // Create JSON download data
      const downloadData = JSON.stringify(
         {
            title: template.title,
            content: template.content,
            categories: template.categories.map((c) => c.name),
            recommendedModel: template.recommendedModel,
         },
         null,
         2
      );

      return {
         success: true,
         message: "Template ready for download.",
         data: downloadData,
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};
