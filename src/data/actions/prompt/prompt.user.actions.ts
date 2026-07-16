"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { EMPTY_PAGE, formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import {
   CategoryNameConflictError,
   ModelNameConflictError,
} from "@/data/services/prompt/errors";
import { DbClient } from "@/data/types/db/common";
import {
   DPrompt,
   DPromptCategoriesPage,
   DPromptCategoriesPageQuery,
   DPromptCategoryUpdate,
   DPromptCategoryWithUsage,
   DPromptModelsPage,
   DPromptModelsPageQuery,
   DPromptModelUpdate,
   DPromptModelWithUsage,
   DPromptPreviewsPage,
   DPromptPreviewsPageQuery,
   DPromptsPage,
   DPromptsPageQuery,
   DPromptsUsage,
   DPromptTemplatingData,
   DPromptUpdate,
   DPromptUpdateCrate,
   DPromptVariableValues,
   DPromptWithContent,
} from "@/data/types/domain/prompt";
import { DPrompt0Update } from "@/data/types/domain/prompt0";
import { ActionResult } from "@/data/types/utils";
import {
   updatePromptCategorySchema,
   updatePromptModelSchema,
} from "@/data/types/validators/template";
import { SubscriptionAccessError } from "@/lib/subscription/server-guards";
import { AiLibAuthenticationError } from "../types";

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

export const getPromptPreviewsPage = async (
   query?: DPromptPreviewsPageQuery
): Promise<DPromptPreviewsPage> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getPromptPreviewsPage(user.id, query);
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
   promptId: string
): Promise<DPromptTemplatingData | null> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getPromptGenerationData(user.id, promptId);
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
   promptId: string,
   isFavorite: boolean
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(promptId)) {
         throw new Error("Invalid Descriptor ID.");
      }

      const user = await requireUser();
      const service = getService();
      await service.togglePromptFavorite(user.id, promptId, isFavorite);

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

export const getPromptCategoriesPage = async (
   query?: DPromptCategoriesPageQuery
): Promise<DPromptCategoriesPage> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getPromptCategoriesPage(user.id, query);
   } catch (error) {
      console.error(formatError(error));
      return EMPTY_PAGE;
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

export const getPromptCategoriesWithUsage = async (): Promise<
   DPromptCategoryWithUsage[]
> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getPromptCategoriesWithUsage(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const createPromptCategory = async (
   data: DPromptCategoryUpdate
): Promise<ActionResult> => {
   try {
      const vData = updatePromptCategorySchema.parse(data);

      const user = await requireUser();
      const service = getService();
      await service.createPromptCategory(user.id, vData);

      return {
         success: true,
         message: "Kategorie erfolgreich erstellt",
      };
   } catch (error) {
      console.error(formatError(error));

      if (error instanceof CategoryNameConflictError) {
         return {
            success: false,
            message: error.message,
         };
      }

      return {
         success: false,
         message: "Kategorie konnte nicht erstellt werden",
      };
   }
};

export const updatePromptCategory = async (
   categoryId: number,
   update: DPromptCategoryUpdate
): Promise<ActionResult> => {
   try {
      const vUpdate = updatePromptCategorySchema.parse(update);

      const user = await requireUser();
      const service = getService();
      await service.updatePromptCategory(user.id, categoryId, vUpdate);

      return {
         success: true,
         message: "Kategorie erfolgreich umbenannt",
      };
   } catch (error) {
      console.error(formatError(error));

      if (error instanceof CategoryNameConflictError) {
         return {
            success: false,
            message: error.message,
         };
      }

      return {
         success: false,
         message: "Kategorie konnte nicht umbenannt werden",
      };
   }
};

export const deletePromptCategory = async (
   categoryId: number
): Promise<ActionResult> => {
   try {
      const user = await requireUser();
      const service = getService();
      await service.deletePromptCategory(user.id, categoryId);

      return {
         success: true,
         message: "Kategorie erfolgreich gelöscht",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Kategorie konnte nicht gelöscht werden",
      };
   }
};

export const isConflictingPromptCategoryName = async (
   categoryId: number | undefined,
   name: string
): Promise<boolean> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.isConflictingPromptCategoryName(
         user.id,
         categoryId,
         name
      );
   } catch (error) {
      console.error(formatError(error));
      return false;
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

export const getPromptModelsPage = async (
   query?: DPromptModelsPageQuery
): Promise<DPromptModelsPage> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getPromptModelsPage(user.id, query);
   } catch (error) {
      console.error(formatError(error));
      return EMPTY_PAGE;
   }
};

export const getPromptModelsWithUsage = async (): Promise<
   DPromptModelWithUsage[]
> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getPromptModelsWithUsage(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const createPromptModel = async (
   data: DPromptModelUpdate
): Promise<ActionResult> => {
   try {
      const vData = updatePromptModelSchema.parse(data);

      const user = await requireUser();
      const service = getService();
      await service.createPromptModel(user.id, vData);

      return {
         success: true,
         message: "Modell erfolgreich erstellt",
      };
   } catch (error) {
      console.error(formatError(error));

      if (error instanceof ModelNameConflictError) {
         return {
            success: false,
            message: error.message,
         };
      }

      return {
         success: false,
         message: "Modell konnte nicht erstellt werden",
      };
   }
};

export const updatePromptModel = async (
   modelId: number,
   update: DPromptModelUpdate
): Promise<ActionResult> => {
   try {
      const vUpdate = updatePromptModelSchema.parse(update);

      const user = await requireUser();
      const service = getService();
      await service.updatePromptModel(user.id, modelId, vUpdate);

      return {
         success: true,
         message: "Modell erfolgreich umbenannt",
      };
   } catch (error) {
      console.error(formatError(error));

      if (error instanceof ModelNameConflictError) {
         return {
            success: false,
            message: error.message,
         };
      }

      return {
         success: false,
         message: "Modell konnte nicht umbenannt werden",
      };
   }
};

export const deletePromptModel = async (
   modelId: number
): Promise<ActionResult> => {
   try {
      const user = await requireUser();
      const service = getService();
      await service.deletePromptModel(user.id, modelId);

      return {
         success: true,
         message: "Modell erfolgreich gelöscht",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Modell konnte nicht gelöscht werden",
      };
   }
};

export const isConflictingPromptModelName = async (
   modelId: number | undefined,
   name: string
): Promise<boolean> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.isConflictingPromptModelName(
         user.id,
         modelId,
         name
      );
   } catch (error) {
      console.error(formatError(error));
      return false;
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
