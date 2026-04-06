"use server";

import { isEmpty } from "es-toolkit/compat";
import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DCollection, DCollectionUpdate } from "@/data/types/domain/collection";
import { ActionResult } from "@/data/types/utils";

export const getCollections = async (): Promise<DCollection[]> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getCollections(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const getCollectionById = async (
   collectionId: string
): Promise<DCollection | null> => {
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

export const getCollectionByPublicToken = async (
   token: string
): Promise<DCollection | null> => {
   try {
      if (isEmpty(token)) {
         throw new Error("Invalid token.");
      }
      const service = getService();
      return await service.getCollectionByPublicToken(token);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const createCollection = async (
   data: DCollectionUpdate
): Promise<ActionResult<DCollection>> => {
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

export const updateCollection = async (
   collectionId: string,
   data: DCollectionUpdate
): Promise<ActionResult<DCollection>> => {
   try {
      if (!isValidUuid(collectionId)) {
         throw new Error("Invalid collection ID.");
      }

      const user = await requireUser();
      const service = getService();
      const collection = await service.updateCollection(
         user.id,
         collectionId,
         data
      );

      return {
         success: true,
         message: "Sammlung erfolgreich aktualisiert",
         data: collection,
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Sammlung konnte nicht aktualisiert werden",
      };
   }
};

export const deleteCollection = async (
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

export const getCollectionTemplateIds = async (
   collectionId: string
): Promise<string[]> => {
   try {
      if (!isValidUuid(collectionId)) {
         throw new Error("Invalid collection ID.");
      }
      const user = await requireUser();
      const service = getService();
      return await service.getCollectionTemplateIds(user.id, collectionId);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const addTemplateToCollection = async (
   collectionId: string,
   templateDescriptorId: string
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(collectionId) || !isValidUuid(templateDescriptorId)) {
         throw new Error("Invalid collection or template ID.");
      }

      const user = await requireUser();
      const service = getService();
      await service.addTemplateToCollection(
         user.id,
         collectionId,
         templateDescriptorId
      );

      return {
         success: true,
         message: "Vorlage hinzugefügt",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Vorlage konnte nicht hinzugefügt werden",
      };
   }
};

export const removeTemplateFromCollection = async (
   collectionId: string,
   templateDescriptorId: string
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(collectionId) || !isValidUuid(templateDescriptorId)) {
         throw new Error("Invalid collection or template ID.");
      }
      const user = await requireUser();
      const service = getService();
      await service.removeTemplateFromCollection(
         user.id,
         collectionId,
         templateDescriptorId
      );

      return {
         success: true,
         message: "Vorlage entfernt",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Vorlage konnte nicht entfernt werden",
      };
   }
};

export const setCollectionPublic = async (
   collectionId: string,
   isPublic: boolean
): Promise<ActionResult<DCollection>> => {
   try {
      if (!isValidUuid(collectionId)) {
         throw new Error("Invalid collection ID.");
      }

      const user = await requireUser();
      const service = getService();
      const collection = await service.setCollectionPublic(
         user.id,
         collectionId,
         isPublic
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

export const getPublicCollectionByToken = async (
   publicToken: string
): Promise<{
   collection: DCollection;
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
      const collection = await service.getCollectionByPublicToken(publicToken);
      if (!collection) {
         return null;
      }

      const templates = await service.getPublicCollectionTemplates(
         collection.id
      );
      return { collection, templates };
   } catch (error) {
      console.error(formatError(error));
      return null;
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
   return factory.getCollectionService();
};
