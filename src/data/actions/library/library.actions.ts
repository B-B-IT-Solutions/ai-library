"use server";

import { v4 as uuidv4 } from "uuid";
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

export const getLibraryCollections = async (): Promise<
   DLibraryCollection[]
> => {
   try {
      const user = await requireUser();
      const service = getService();
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
      const service = getService();
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
      const service = getService();
      await service.updateCollection(user.id, collectionId, data);

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
      const service = getService();
      await service.deleteCollection(user.id, collectionId);

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

export const getLibraryCollectionById = async (
   collectionId: string
): Promise<DLibraryCollection | null> => {
   try {
      if (!isValidUuid(collectionId)) {
         throw new Error("Invalid collection ID.");
      }
      const user = await requireUser();
      const service = getService();
      return await service.getCollectionById(user.id, collectionId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const getLibraryCollectionByShareToken = async (
   shareToken: string
): Promise<DLibraryCollection | null> => {
   try {
      const service = getService();
      return await service.getCollectionByShareToken(shareToken);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const getPublicCollectionByToken = async (
   shareToken: string
): Promise<{
   collection: DLibraryCollection;
   templates: {
      id: string;
      title: string;
      description: string;
      recommendedModel: string;
      categories: { name: string }[];
   }[];
} | null> => {
   try {
      const service = getService();
      const collection = await service.getCollectionByShareToken(shareToken);
      if (!collection) return null;

      const templates = await service.getPublicCollectionTemplates(
         collection.id
      );
      return { collection, templates };
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const setLibraryCollectionSharing = async (
   collectionId: string,
   isPublic: boolean
): Promise<ActionResult<DLibraryCollection>> => {
   try {
      if (!isValidUuid(collectionId)) {
         throw new Error("Invalid collection ID.");
      }
      const user = await requireUser();
      const service = getService();

      let shareToken: string | null = null;
      if (isPublic) {
         shareToken = uuidv4();
      }

      const collection = await service.setCollectionSharing(
         user.id,
         collectionId,
         isPublic,
         shareToken
      );

      return {
         success: true,
         message: isPublic
            ? "Sammlung ist jetzt öffentlich zugänglich"
            : "Sammlung ist jetzt privat",
         data: collection,
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Freigabe konnte nicht geändert werden",
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
      const service = getService();
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
      const service = getService();
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

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getLibraryService();
};
