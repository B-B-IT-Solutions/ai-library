"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DLibraryEntry,
   DLibraryEntryWithPromptTemplate,
} from "@/data/types/domain/library";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import {
   DPromptTemplateField,
   DPromptTemplateFieldValues,
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

export type CreateCustomTemplateInput = {
   title: string;
   description: string;
   content: string;
   detailedDescription: string;
   recommendedModel: string;
   categories: string[];
   fields: DPromptTemplateField[];
};

export const createCustomTemplate = async (
   input: CreateCustomTemplateInput
): Promise<ActionResult<string>> => {
   try {
      const user = await requireUser();
      const service = getLibrarySevice();
      const entryId = await service.createCustomTemplate(input, user.id);
      return {
         success: true,
         message: "Vorlage erfolgreich erstellt",
         data: entryId,
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

const getLibrarySevice = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getLibraryService();
};
