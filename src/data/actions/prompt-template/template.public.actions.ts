"use server";

import { EMPTY_PAGE, formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DTemplateDescriptorsPage,
   DTemplateDescriptorsPageQuery,
} from "@/data/types/domain/prompt.template";

export const getPublicTemplateDescriptorsPage = async (
   query: DTemplateDescriptorsPageQuery
): Promise<DTemplateDescriptorsPage> => {
   try {
      const service = getService();
      return await service.getPublicTemplateDescriptorsPage(query);
   } catch (error) {
      console.error(formatError(error));
      return EMPTY_PAGE;
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getPublicTemplateService();
};
