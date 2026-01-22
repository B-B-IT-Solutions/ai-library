"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

import { auth, signOut } from "@/auth";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { ActionResult } from "@/data/types/utils";
import {
   changePasswordSchema,
   deleteAccountSchema,
   updateProfileSchema,
} from "@/data/types/validators/settings.schema";

export const updateProfile = async (name: string): Promise<ActionResult> => {
   try {
      const validatedData = updateProfileSchema.parse({ name });
      const userService = getUserService();
      await userService.updateProfile(validatedData.name);

      return {
         success: true,
         message: "Profil erfolgreich aktualisiert",
      };
   } catch (error) {
      if (isRedirectError(error)) {
         throw error;
      }
      return {
         success: false,
         message: "Fehler beim Aktualisieren des Profils",
      };
   }
};

export const changePassword = async (
   currentPassword: string,
   newPassword: string,
   confirmPassword: string
): Promise<ActionResult> => {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return {
            success: false,
            message: "Nicht authentifiziert",
         };
      }

      const validatedData = changePasswordSchema.parse({
         currentPassword,
         newPassword,
         confirmPassword,
      });

      const userService = getUserService();
      const result = await userService.changePassword(
         session.user.id,
         validatedData.currentPassword,
         validatedData.newPassword
      );

      if (result.success) {
         // Sign out user after password change
         await signOut({ redirect: false });
      }

      return result;
   } catch (error) {
      if (isRedirectError(error)) {
         throw error;
      }
      return {
         success: false,
         message: "Fehler beim Ändern des Passworts",
      };
   }
};

export const deleteAccount = async (
   password: string
): Promise<ActionResult> => {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return {
            success: false,
            message: "Nicht authentifiziert",
         };
      }

      const validatedData = deleteAccountSchema.parse({ password });

      const userService = getUserService();
      const result = await userService.deleteAccount(
         session.user.id,
         validatedData.password
      );

      if (result.success) {
         await signOut({ redirect: false });
         redirect("/p");
      }

      return result;
   } catch (error) {
      if (isRedirectError(error)) {
         throw error;
      }
      return {
         success: false,
         message: "Fehler beim Löschen des Kontos",
      };
   }
};

const getUserService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getUserService();
};
