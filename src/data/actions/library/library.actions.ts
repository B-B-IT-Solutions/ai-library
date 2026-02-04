"use server";

import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DLibraryEntry } from "@/data/types/domain/library";
import { DPromptUpdate } from "@/data/types/domain/prompt";
import { DTemplateFieldValues } from "@/data/types/domain/template.field";
import { ActionResult } from "@/data/types/utils";

export const getLibraryEntries = async (): Promise<DLibraryEntry[]> => {
   const service = getLibrarySevice();
   return service.getLibraryEntries();
};

export const getLibraryEntry = async (
   entryId: string
): Promise<DLibraryEntry | null> => {
   try {
      const service = getLibrarySevice();
      return await service.getLibraryEntry(entryId);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

export const createPromptFromTemplate = async (
   templateId: string
): Promise<ActionResult> => {
   try {
      const service = getLibrarySevice();
      await service.createPromptFromTemplate(templateId);

      return {
         success: true,
         message: "Template copied to your prompts successfully!",
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const downloadTemplate = async (
   templateId: string
): Promise<ActionResult<string>> => {
   try {
      const service = getLibrarySevice();
      const downloadData = await service.downloadPromptTemplate(templateId);

      return {
         success: true,
         message: "Template ready for download.",
         data: downloadData,
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const generatePromptFromTemplate = async (
   templateId: string,
   fieldValues: DTemplateFieldValues
): Promise<ActionResult<DPromptUpdate>> => {
   try {
      const service = getLibrarySevice();
      const promptData = await service.generatePromptFromTemplate(
         templateId,
         fieldValues
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

const getLibrarySevice = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getLibraryService();
};
