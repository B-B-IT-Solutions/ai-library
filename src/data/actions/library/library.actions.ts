"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DLibraryCollection,
   DLibraryCollectionUpdate,
} from "@/data/types/domain/library";
import { ActionResult } from "@/data/types/utils";

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
