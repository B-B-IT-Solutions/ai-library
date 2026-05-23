"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { EMPTY_PAGE, formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DPrompt,
   DPromptGenerationData,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptsUsage,
   DPromptUpdate,
   DPromptUpdateCrate,
   DPromptVariableValues,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { DPrompt0Update } from "@/data/types/domain/prompt0";
import { ActionResult } from "@/data/types/utils";
import { SubscriptionAccessError } from "@/lib/subscription/server-guards";
import { AiLibAuthenticationError } from "../types";

type DGetPromptTemplatesParams = {
   search?: string;
   categories?: string[];
};

export const getPromptsPage = async (
   query?: DPromptsPageQuery
): Promise<DPromptsPage> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getPromptsPage(user.id, query);
   } catch (error) {
      console.error(formatError(error));
      return EMPTY_PAGE;
   }
};

export const getPrompt = async (promptId: string): Promise<DPrompt | null> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getPrompt(user.id, promptId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const getPromptWithContent = async (
   promptId: string
): Promise<DPromptWithContent | null> => {
   try {
      if (!isValidUuid(promptId)) {
         throw new Error("Invalid Template ID.");
      }

      const user = await requireUser();
      const service = getService();
      return await service.getPromptWithContent(user.id, promptId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const createPrompt = async (
   crate: DPromptUpdateCrate
): Promise<ActionResult<DPrompt>> => {
   try {
      const user = await requireUser();
      const service = getService();
      const prompt = await service.createPrompt(user.id, crate);

      return {
         success: true,
         message: "Vorlage erfolgreich erstellt",
         data: prompt,
      };
   } catch (error) {
      console.error(formatError(error));

      if (error instanceof SubscriptionAccessError) {
         return {
            success: false,
            message: error.message,
            upgradeRequired: true,
         };
      }

      return {
         success: false,
         message: "Vorlage konnte nicht erstellt werden",
      };
   }
};

export const updatePrompt = async (
   descriptorId: string,
   data: DPromptUpdate
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid Descriptor ID.");
      }

      const user = await requireUser();
      const service = getService();
      await service.updatePrompt(user.id, descriptorId, data);

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

export const deletePrompt = async (
   descriptorId: string
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid Descriptor ID.");
      }

      const user = await requireUser();
      const service = getService();
      await service.deletePrompt(user.id, descriptorId);

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

export const getPromptGenerationData = async (
   templateId: string
): Promise<DPromptGenerationData | null> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getPromptGenerationData(user.id, templateId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const composePromptFromTemplate = async (
   descriptorId: string,
   fieldValues: DPromptVariableValues
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

export const downloadPrompt = async (
   descriptorId: string
): Promise<ActionResult<string>> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid Descriptor ID.");
      }

      const user = await requireUser();

      const service = getService();
      const downloadData = await service.downloadPrompt(user.id, descriptorId);

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

export const togglePromptFavorite = async (
   descriptorId: string,
   isFavorite: boolean
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid Descriptor ID.");
      }

      const user = await requireUser();
      const service = getService();
      await service.togglePromptFavorite(user.id, descriptorId, isFavorite);

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

export const getPromptCategories = async (): Promise<string[]> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getPromptCategories(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const getPromptModels = async (): Promise<string[]> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getPromptModels(user.id);
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
      const service = getService();
      return await service.getPromptsUsage(user.id);
   } catch (error) {
      if (error instanceof AiLibAuthenticationError) {
         console.error(formatError(error));
         const fallback: DPromptsUsage = { current: 0, limit: 0 };
         return fallback;
      } else {
         console.error(
            "DPromptUsage can't be retrieved, falling back to unlimited",
            formatError(error)
         );

         const fallback: DPromptsUsage = { current: 0, limit: -1 };
         return fallback;
      }
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getPromptService();
};
