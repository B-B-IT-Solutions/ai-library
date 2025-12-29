"use server";

import prisma from "@/data/db/prisma";
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
   const service = getLibrarySevice();
   return service.copyTemplateToPrompts(templateId);
};

export const downloadTemplate = async (
   templateId: string
): Promise<ActionResult<string>> => {
   const service = getLibrarySevice();
   return service.downloadTemplate(templateId);
};

const getLibrarySevice = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getLibraryService();
};
