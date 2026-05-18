"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { EMPTY_PAGE, formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DPrompt,
   DPromptFieldValues,
   DPromptGenerationData,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptsUsage,
   DPromptUpdate,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { DPrompt0Update } from "@/data/types/domain/prompt0";
import { ActionResult } from "@/data/types/utils";
import { TIER_FEATURES } from "@/lib/subscription/access-control";
import {
   requireCountLimit,
   SubscriptionAccessError,
} from "@/lib/subscription/server-guards";

type DGetPromptTemplatesParams = {
   search?: string;
   categories?: string[];
};

export const getTemplateDescriptorsPage = async (
   query?: DPromptsPageQuery
): Promise<DPromptsPage> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getTemplateDescriptorsPage(user.id, query);
   } catch (error) {
      console.error(formatError(error));
      return EMPTY_PAGE;
   }
};

export const getTemplateDescriptor = async (
   descriptorId: string
): Promise<DPrompt | null> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getTemplateDescriptor(user.id, descriptorId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const createTemplateDescriptor = async (
   data: DPromptUpdate
): Promise<ActionResult> => {
   try {
      const user = await requireUser();
      const service = getService();

      const currentCount = await service.getPromptsCount(user.id);
      await requireCountLimit("maxPrompts", currentCount);

      await service.createTemplateDescriptor(user.id, data);
      return {
         success: true,
         message: "Vorlage erfolgreich erstellt",
      };
   } catch (error) {
      if (error instanceof SubscriptionAccessError) {
         return {
            success: false,
            message: error.message,
            upgradeRequired: true,
         };
      }
      console.error(formatError(error));
      return {
         success: false,
         message: "Vorlage konnte nicht erstellt werden",
      };
   }
};

export const updateTemplateDescriptor = async (
   descriptorId: string,
   data: DPromptUpdate
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid Descriptor ID.");
      }

      const user = await requireUser();
      const service = getService();
      await service.updateTemplateDescriptor(user.id, descriptorId, data);

      return {
         success: true,
         message: "Vorlage erfolgreich aktualisiert",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Vorlage konnte nicht aktualisiert werden",
      };
   }
};

export const deleteTemplateDescriptor = async (
   descriptorId: string
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid Descriptor ID.");
      }

      const user = await requireUser();
      const service = getService();
      await service.deleteTemplateDescriptor(user.id, descriptorId);

      return {
         success: true,
         message: "Vorlage erfolgreich gelöscht",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Vorlage konnte nicht gelöscht werden",
      };
   }
};

export const getPromptGenerationTemplateData = async (
   templateId: string
): Promise<DPromptGenerationData | null> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getTemplateDataForPromptGeneration(
         user.id,
         templateId
      );
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const composePromptFromTemplate = async (
   descriptorId: string,
   fieldValues: DPromptFieldValues
): Promise<ActionResult<DPrompt0Update>> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid Descriptor ID.");
      }

      const user = await requireUser();

      const service = getService();
      const promptData = await service.composePromptFromTemplate(
         user.id,
         descriptorId,
         fieldValues
      );
      return {
         success: true,
         message: "Prompt erfolgreich generiert",
         data: promptData,
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Prompt konnte nicht generiert werden",
      };
   }
};

export const downloadTemplate = async (
   descriptorId: string
): Promise<ActionResult<string>> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid Descriptor ID.");
      }

      const user = await requireUser();

      const service = getService();
      const downloadData = await service.downloadTemplate(
         user.id,
         descriptorId
      );

      return {
         success: true,
         message: "Vorlage erfolgreich heruntergeladen.",
         data: downloadData,
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Vorlage konnte nicht heruntergeladen werden",
      };
   }
};

export const toggleTemplateDescriptorFavorite = async (
   descriptorId: string,
   isFavorite: boolean
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid Descriptor ID.");
      }

      const user = await requireUser();
      const service = getService();
      await service.toggleTemplateDescriptorFavorite(
         user.id,
         descriptorId,
         isFavorite
      );

      return {
         success: true,
         message: isFavorite
            ? "Zu Favoriten hinzugefügt"
            : "Aus Favoriten entfernt",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Die Anfrage konnte nicht bearbeitet werden",
      };
   }
};

export const getTemplateDescriptorCategories = async (): Promise<string[]> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getTemplateDescriptorCategories(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const getTemplateDescriptorModels = async (): Promise<string[]> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getTemplateDescriptorModels(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const getPromptTemplates = async (
   params?: DGetPromptTemplatesParams
): Promise<DPrompt[]> => {
   const service = getService();
   return await service.getPrompts(params);
};

export const getPromptTemplate = async (
   templateId: string
): Promise<DPromptWithContent | null> => {
   try {
      if (!isValidUuid(templateId)) {
         throw new Error("Invalid Template ID.");
      }

      const user = await requireUser();
      const service = getService();
      return await service.getPromptTemplate(user.id, templateId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const getPromptTemplateCategories = async (): Promise<string[]> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getPromptTemplateCategories(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const getPromptsUsage = async (): Promise<DPromptsUsage> => {
   try {
      const user = await requireUser();
      const factory = new ServiceFactory(prisma);
      const [current, tier] = await Promise.all([
         factory.getPromptService().getPromptsCount(user.id),
         factory.getSubscriptionService().getUserTier(user.id),
      ]);
      const limit = TIER_FEATURES[tier].maxPrompts;
      return { current, limit };
   } catch {
      return { current: 0, limit: -1 };
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getPromptService();
};
