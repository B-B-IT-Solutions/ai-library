"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   CreateCollectionInput,
   DLibraryCollection,
   DLibraryEntriesPage,
   DLibraryEntriesPageQuery,
   DLibraryEntry,
   DLibraryEntryWithPromptTemplate,
   UpdateCollectionInput,
} from "@/data/types/domain/library";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplateFieldValues,
   DPromptTemplateUpdate,
} from "@/data/types/domain/prompt.template";
import { ActionResult } from "@/data/types/utils";

export const getLibraryEntries = async (): Promise<DLibraryEntry[]> => {
   try {
      const user = await requireUser();
      const service = getLibrarySevice();
      return service.getLibraryEntries(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const getLibraryEntry = async (
   entryId: string
): Promise<DLibraryEntryWithPromptTemplate | null> => {
   try {
      const user = await requireUser();
      const service = getLibrarySevice();
      return await service.getLibraryEntry(entryId, user.id);
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
      const service = getLibrarySevice();
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

export const composePromptFromTemplate = async (
   descriptorId: string,
   fieldValues: DPromptTemplateFieldValues
): Promise<ActionResult<DPromptUpdate>> => {
   try {
      if (!isValidUuid(descriptorId)) {
         throw new Error("Invalid template ID.");
      }

      const user = await requireUser();

      const service = getLibrarySevice();
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

      const service = getLibrarySevice();
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

// ==================== Filtering & Pagination ====================

export const getLibraryEntriesPage = async (
   query?: DLibraryEntriesPageQuery
): Promise<DLibraryEntriesPage> => {
   try {
      const user = await requireUser();
      const service = getLibrarySevice();
      return await service.getLibraryEntriesPage(user.id, query);
   } catch (error) {
      console.error(formatError(error));
      return {
         content: [],
         pageNumber: 1,
         pageSize: 20,
         totalPages: 0,
         totalEntries: 0,
      };
   }
};

export const getLibraryCategories = async (): Promise<string[]> => {
   try {
      const user = await requireUser();
      const service = getLibrarySevice();
      return await service.getLibraryCategories(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const getLibraryModels = async (): Promise<string[]> => {
   try {
      const user = await requireUser();
      const service = getLibrarySevice();
      return await service.getLibraryModels(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

// ==================== Favorites ====================

export const toggleLibraryEntryFavorite = async (
   entryId: string,
   isFavorite: boolean
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(entryId)) {
         throw new Error("Invalid entry ID.");
      }

      const user = await requireUser();
      const service = getLibrarySevice();
      await service.toggleFavorite(entryId, user.id, isFavorite);

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
         message: formatError(error),
      };
   }
};

// ==================== Collections CRUD ====================

export const getLibraryCollections = async (): Promise<
   DLibraryCollection[]
> => {
   try {
      const user = await requireUser();
      const service = getLibrarySevice();
      return await service.getCollections(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const createLibraryCollection = async (
   data: CreateCollectionInput
): Promise<ActionResult<DLibraryCollection>> => {
   try {
      const user = await requireUser();
      const service = getLibrarySevice();
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
         message: formatError(error),
      };
   }
};

export const updateLibraryCollection = async (
   collectionId: string,
   data: UpdateCollectionInput
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(collectionId)) {
         throw new Error("Invalid collection ID.");
      }

      const user = await requireUser();
      const service = getLibrarySevice();
      await service.updateCollection(collectionId, user.id, data);

      return {
         success: true,
         message: "Sammlung erfolgreich aktualisiert",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: formatError(error),
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
      const service = getLibrarySevice();
      await service.deleteCollection(collectionId, user.id);

      return {
         success: true,
         message: "Sammlung erfolgreich gelöscht",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: formatError(error),
      };
   }
};

// ==================== Collection Entries ====================

export const addEntryToCollection = async (
   collectionId: string,
   entryId: string
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(collectionId) || !isValidUuid(entryId)) {
         throw new Error("Invalid ID.");
      }

      const service = getLibrarySevice();
      await service.addToCollection(collectionId, entryId);

      return {
         success: true,
         message: "Zur Sammlung hinzugefügt",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const removeEntryFromCollection = async (
   collectionId: string,
   entryId: string
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(collectionId) || !isValidUuid(entryId)) {
         throw new Error("Invalid ID.");
      }

      const service = getLibrarySevice();
      await service.removeFromCollection(collectionId, entryId);

      return {
         success: true,
         message: "Aus Sammlung entfernt",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: formatError(error),
      };
   }
};

const getLibrarySevice = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getLibraryService();
};
