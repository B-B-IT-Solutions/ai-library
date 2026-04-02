"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { EMPTY_PAGE, formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DLibraryCollection,
   DLibraryCollectionUpdate,
} from "@/data/types/domain/library";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplateDescriptorWithTemplate,
   DPromptTemplateFieldValues,
   DPromptTemplateUpdate,
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";
import { ActionResult } from "@/data/types/utils";

export const getLibraryEntriesPage = async (
   query?: DTemplateDescriptorsPageQuery
): Promise<DTemplateDescriptorsPage> => {
   try {
      const user = await requireUser();
      const service = getSevice();
      return await service.getLibraryEntriesPage(user.id, query);
   } catch (error) {
      console.error(formatError(error));
      return EMPTY_PAGE;
   }
};

export const getLibraryEntry = async (
   descriptorId: string
): Promise<DPromptTemplateDescriptorWithTemplate | null> => {
   try {
      const user = await requireUser();
      const service = getSevice();
      return await service.getLibraryEntry(user.id, descriptorId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const createLibraryEntry = async (
   data: DPromptTemplateUpdate
): Promise<ActionResult> => {
   try {
      const user = await requireUser();
      const service = getSevice();
      await service.createLibraryEntry(data, user.id);
      return {
         success: true,
         message: "Vorlage erfolgreich erstellt",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Vorlage konnte nicht erstellt werden",
      };
   }
};

export const updateLibraryEntry = async (
   descriptorId: string,
   data: DPromptTemplateUpdate
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid Entry ID.");
      }

      const user = await requireUser();
      const service = getSevice();
      await service.updateLibraryEntry(user.id, descriptorId, data);

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

export const deleteLibraryEntry = async (
   descriptorId: string
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid Entry ID.");
      }

      const user = await requireUser();
      const service = getSevice();
      await service.deleteLibraryEntry(user.id, descriptorId);

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

export const composePromptFromTemplate = async (
   descriptorId: string,
   fieldValues: DPromptTemplateFieldValues
): Promise<ActionResult<DPromptUpdate>> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid template ID.");
      }

      const user = await requireUser();

      const service = getSevice();
      const promptData = await service.composePromptFromTemplate(
         descriptorId,
         fieldValues,
         user.id
      );
      return {
         success: true,
         message: "Prompt erfolgreich generiert",
         data: promptData,
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const downloadTemplate = async (
   descriptorId: string
): Promise<ActionResult<string>> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid template ID.");
      }

      const user = await requireUser();

      const service = getSevice();
      const downloadData = await service.downloadPromptTemplate(
         descriptorId,
         user.id
      );

      return {
         success: true,
         message: "Template ready for download.",
         data: downloadData,
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const getLibraryCategories = async (): Promise<string[]> => {
   try {
      const user = await requireUser();
      const service = getSevice();
      return await service.getLibraryCategories(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const getLibraryModels = async (): Promise<string[]> => {
   try {
      const user = await requireUser();
      const service = getSevice();
      return await service.getLibraryModels(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const toggleLibraryEntryFavorite = async (
   descriptorId: string,
   isFavorite: boolean
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid Entry ID.");
      }

      const user = await requireUser();
      const service = getSevice();
      await service.toggleFavorite(descriptorId, user.id, isFavorite);

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

export const getLibraryCollections = async (): Promise<
   DLibraryCollection[]
> => {
   try {
      const user = await requireUser();
      const service = getSevice();
      return await service.getCollections(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const createLibraryCollection = async (
   data: DLibraryCollectionUpdate
): Promise<ActionResult<DLibraryCollection>> => {
   try {
      const user = await requireUser();
      const service = getSevice();
      const collection = await service.createCollection(user.id, data);

      return {
         success: true,
         message: "Sammlung erfolgreich erstellt",
         data: collection,
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Sammlung konnte nicht erstellt werden",
      };
   }
};

export const updateLibraryCollection = async (
   collectionId: string,
   data: DLibraryCollectionUpdate
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(collectionId)) {
         throw new Error("Invalid collection ID.");
      }

      const user = await requireUser();
      const service = getSevice();
      await service.updateCollection(collectionId, user.id, data);

      return {
         success: true,
         message: "Sammlung erfolgreich aktualisiert",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Sammlung konnte nicht aktualisiert werden",
      };
   }
};

export const deleteLibraryCollection = async (
   collectionId: string
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(collectionId)) {
         throw new Error("Invalid collection ID.");
      }

      const user = await requireUser();
      const service = getSevice();
      await service.deleteCollection(collectionId, user.id);

      return {
         success: true,
         message: "Sammlung erfolgreich gelöscht",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Sammlung konnte nicht gelöscht werden",
      };
   }
};

export const getEntryCollectionIds = async (
   entryId: string
): Promise<string[]> => {
   try {
      if (!isValidUuid(entryId)) {
         throw new Error("Invalid Entry ID.");
      }

      const user = await requireUser();
      const service = getSevice();
      return await service.getEntryCollectionIds(user.id, entryId);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const updateEntryCollections = async (
   entryId: string,
   collectionIds: string[]
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(entryId)) {
         throw new Error("Invalid Entry ID.");
      }

      const user = await requireUser();
      const service = getSevice();
      await service.updateEntryCollections(user.id, entryId, collectionIds);

      return {
         success: true,
         message: "Sammlungen aktualisiert",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Sammlungen konnten nicht aktualisiert werden",
      };
   }
};

const getSevice = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getLibraryService();
};
