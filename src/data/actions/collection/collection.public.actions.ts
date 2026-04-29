"use server";

import { isEmpty } from "es-toolkit/compat";

import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DCollection } from "@/data/types/domain/collection";

export const getPublicCollectionByToken = async (
   token: string
): Promise<DCollection | null> => {
   try {
      if (isEmpty(token)) {
         throw new Error("Invalid token.");
      }
      const service = getService();
      return await service.getPublicCollectionByToken(token);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getPublicCollectionService();
};
