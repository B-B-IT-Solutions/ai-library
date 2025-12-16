"use server";

import { validate as isValidUuid } from "uuid";

import { auth } from "@/auth";
import { createPrompt as pCreatePrompt } from "@/data/db/queries/prompt";
import {
   pCheckSubscriptionAccess,
   pCheckUserHasTemplate,
   pGetUserPurchases,
} from "@/data/db/queries/purchase";
import { DPurchase } from "@/data/types/domain/library";
import { DPromptTemplate } from "@/data/types/domain/prompt.template";
import { ActionResult } from "@/data/types/utils";
import { PromptCreateInput } from "@/generated/prisma/models";
import { formatError } from "../utils";

import { toDPurchases } from "./library.mapper";

export const getPurchasedTemplates = async (): Promise<DPromptTemplate[]> => {
   const session = await auth();
   if (!session?.user?.id) {
      return [];
   }

   const purchases = await pGetUserPurchases(session.user.id);
   return purchases.map((p) => p.template);
};

export const hasAccessToTemplate = async (
   templateId: string
): Promise<boolean> => {
   const session = await auth();
   if (!session?.user?.id) {
      return false;
   }

   const userId = session.user.id;

   // Check subscription access
   const hasSubscription = await pCheckSubscriptionAccess(userId);
   if (hasSubscription) {
      return true;
   }

   // Check purchase access
   return await pCheckUserHasTemplate(userId, templateId);
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

      const session = await auth();
      if (!session?.user?.id) {
         return {
            success: false,
            message: "You must be logged in to copy templates.",
         };
      }

      // Check access
      const hasAccess = await hasAccessToTemplate(templateId);
      if (!hasAccess) {
         return {
            success: false,
            message: "You do not have access to this template.",
         };
      }

      // Get template
      const purchases = await pGetUserPurchases(session.user.id);
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

      const session = await auth();
      if (!session?.user?.id) {
         return {
            success: false,
            message: "You must be logged in to download templates.",
         };
      }

      // Check access
      const hasAccess = await hasAccessToTemplate(templateId);
      if (!hasAccess) {
         return {
            success: false,
            message: "You do not have access to this template.",
         };
      }

      // Get template
      const purchases = await pGetUserPurchases(session.user.id);
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
