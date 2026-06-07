"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DCollection,
   DCollectionPreview,
   DCollectionUpdate,
} from "@/data/types/domain/collection";
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

export const getCollectionPreviews = async (): Promise<
   DCollectionPreview[]
> => {
   try {
      const user = await requireUser();
      const service = getService();
      return await service.getCollectionPreviews(user.id);
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

export const getCollectionPreviewById = async (
   collectionId: string
): Promise<DCollection | null> => {
   try {
      if (!isValidUuid(collectionId)) {
         throw new Error("Invalid collection ID.");
      }
      const user = await requireUser();
      const service = getService();
      return await service.getCollectionPreviewById(user.id, collectionId);
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

export const getCollectionPromptIds = async (
   collectionId: string
): Promise<string[]> => {
   try {
      if (!isValidUuid(collectionId)) {
         throw new Error("Invalid collection ID.");
      }
      const user = await requireUser();
      const service = getService();
      return await service.getCollectionPromptIds(user.id, collectionId);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const addPromptToCollection = async (
   collectionId: string,
   promptId: string
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(collectionId) || !isValidUuid(promptId)) {
         throw new Error("Invalid collection or template ID.");
      }

      const user = await requireUser();
      const service = getService();
      await service.addPromptToCollection(user.id, collectionId, promptId);

      return {
         success: true,
         message: "Prompt hinzugefügt",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Prompt konnte nicht hinzugefügt werden",
      };
   }
};

export const removePromptFromCollection = async (
   collectionId: string,
   promptId: string
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(collectionId) || !isValidUuid(promptId)) {
         throw new Error("Invalid collection or template ID.");
      }
      const user = await requireUser();
      const service = getService();
      await service.removePromptFromCollection(user.id, collectionId, promptId);

      return {
         success: true,
         message: "Prompt entfernt",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Prompt konnte nicht entfernt werden",
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

export const getPromptCollectionIds = async (
   entryId: string
): Promise<string[]> => {
   try {
      if (!isValidUuid(entryId)) {
         throw new Error("Invalid Entry ID.");
      }

      const user = await requireUser();
      const service = getService();
      return await service.getPromptCollectionIds(user.id, entryId);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const updatePromptCollections = async (
   entryId: string,
   collectionIds: string[]
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(entryId)) {
         throw new Error("Invalid Entry ID.");
      }

      const user = await requireUser();
      const service = getService();
      await service.updatePromptCollections(user.id, entryId, collectionIds);

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
