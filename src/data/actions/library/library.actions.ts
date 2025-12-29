"use server";

import prisma from "@/data/db/prisma";
import { LibraryRepository } from "@/data/db/queries/library";
import { LibraryService } from "@/data/services/library";
import { OrderProducts } from "@/data/types/db/order";
import { DLibraryEntry } from "@/data/types/domain/library";
import { ActionResult } from "@/data/types/utils";

export const getLibraryEntries = async (): Promise<DLibraryEntry[]> => {
   const service = getLibrarySevice();
   return service.getLibraryEntries();
};

export const createLibraryEntries = async (order: OrderProducts) => {
   const service = getLibrarySevice();
   service.createLibraryEntries(order);
};

export const hasAccessToTemplate = async (
   templateId: string
): Promise<boolean> => {
   const service = getLibrarySevice();
   return service.hasAccessToTemplate(templateId);
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

const getLibrarySevice = () => {
   const repository = new LibraryRepository(prisma);
   return new LibraryService(repository);
};
