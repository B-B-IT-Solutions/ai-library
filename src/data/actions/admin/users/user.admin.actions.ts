"use server";

import { validate as isValidUuid } from "uuid";

import { requireAdmin } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DAdminUserDetail,
   DAdminUsersPage,
   DAdminUsersPageQuery,
} from "@/data/types/domain/admin/admin";
import { ActionResult } from "@/data/types/utils";

export const getAdminUsersPage = async (
   query?: DAdminUsersPageQuery
): Promise<DAdminUsersPage> => {
   await requireAdmin();
   const service = getService();
   return await service.getUsersPage(query);
};

export const getAdminUser = async (
   userId: string
): Promise<DAdminUserDetail | null> => {
   if (!isValidUuid(userId)) {
      return null;
   }

   await requireAdmin();
   const service = getService();
   return await service.getUserDetail(userId);
};

export const updateUserRole = async (
   userId: string,
   role: "user" | "admin"
): Promise<ActionResult> => {
   try {
      if (!isValidUuid(userId)) {
         throw new Error("Invalid user ID.");
      }

      await requireAdmin();
      const service = getService();
      await service.updateUserRole(userId, role);
      return {
         success: true,
         message: "Rolle erfolgreich aktualisiert.",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Rolle konnte nicht aktualisiert werden.",
      };
   }
};

const getService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getAdminUserService();
};
