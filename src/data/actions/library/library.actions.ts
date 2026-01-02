"use server";

import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DLibraryEntry } from "@/data/types/domain/library";
import { ActionResult } from "@/data/types/utils";

export const getLibraryEntries = async (): Promise<DLibraryEntry[]> => {
   const service = getLibrarySevice();
   return service.getLibraryEntries();
};

export const copyTemplateToPrompts = async (
   templateId: string
): Promise<ActionResult> => {
   try {
      const service = getLibrarySevice();
      await service.copyTemplateToPrompts(templateId);

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
      const downloadData = await service.downloadTemplate(templateId);

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

const getLibrarySevice = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getLibraryService();
};
