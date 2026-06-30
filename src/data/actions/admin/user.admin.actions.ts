"use server";

import { validate as isValidUuid } from "uuid";

import { requireAdminUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import { AdminUserRepository } from "@/data/repositories/admin";
import prisma from "@/data/repositories/prisma";
import {
   DAdminUserDetail,
   DAdminUsersPage,
   DAdminUsersPageQuery,
} from "@/data/types/domain/admin";
import { ActionResult } from "@/data/types/utils";

export const getAdminUsersPage = async (
   query?: DAdminUsersPageQuery
): Promise<DAdminUsersPage> => {
   await requireAdminUser();
   const repo = new AdminUserRepository(prisma);
   return repo.pGetUsersPage(query);
};

export const getAdminUserDetail = async (
   userId: string
): Promise<DAdminUserDetail | null> => {
   await requireAdminUser();
   if (!isValidUuid(userId)) return null;
   const repo = new AdminUserRepository(prisma);
   return repo.pGetUserDetail(userId);
};

export const updateUserRole = async (
   userId: string,
   role: "user" | "admin"
): Promise<ActionResult> => {
   try {
      await requireAdminUser();
      if (!isValidUuid(userId)) throw new Error("Invalid user ID.");
      const repo = new AdminUserRepository(prisma);
      await repo.pUpdateUserRole(userId, role);
      return { success: true, message: "Rolle erfolgreich aktualisiert." };
   } catch (error) {
      console.error(formatError(error));
      return { success: false, message: "Rolle konnte nicht aktualisiert werden." };
   }
};
