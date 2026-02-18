"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";

import { signIn, signOut } from "@/auth";
import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DUser,
   DUserAccountDelete,
   DUserPasswordUpdate,
   DUserSignIn,
   DUserSignUp,
   DUserUpdate,
} from "@/data/types/domain/user";
import { ActionResult } from "@/data/types/utils";
import {
   deleteAccountSchema,
   signInSchema,
   signUpSchema,
   updatePasswordSchema,
   updateProfileSchema,
} from "@/data/types/validators/user";

export const signUpUser = async (data: DUserSignUp) => {
   try {
      const validatedData: DUserSignUp = signUpSchema.parse(data);

      const service = getUserService();
      await service.signUpUser(validatedData);

      await signIn("credentials", {
         email: data.email,
         password: data.password,
      });

      return {
         success: true,
         message: "User registered successfully",
      };
   } catch (error) {
      if (isRedirectError(error)) {
         throw error;
      }
      return {
         success: false,
         message: formatError(error),
      };
   }
};

export const signInWithCredentials = async (data: DUserSignIn) => {
   try {
      const singInValues = signInSchema.parse(data);
      await signIn("credentials", singInValues);
      return {
         success: true,
         message: "Signed in successfully",
      };
   } catch (error) {
      if (isRedirectError(error)) {
         throw error;
      }
      return {
         success: false,
         message: "Invalid email or password",
      };
   }
};

export const signOutUser = async () => {
   await signOut({ redirectTo: "/p" });
};

export const getUserById = async (userId: string): Promise<DUser> => {
   const service = getUserService();
   const user = await service.getUserById(userId);
   if (!user) {
      throw new Error("User not found");
   }
   return user;
};

export const updateUserProfile = async (
   data: DUserUpdate
): Promise<ActionResult> => {
   try {
      const user = await requireUser();
      const validatedData = updateProfileSchema.parse(data);

      const service = getUserService();
      service.updateUser(user.id, validatedData);

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

export const updatePassword = async (
   data: DUserPasswordUpdate
): Promise<ActionResult> => {
   try {
      const user = await requireUser();
      const validatedData = updatePasswordSchema.parse(data);

      const userService = getUserService();
      await userService.updatePassword(user.id, validatedData);

      await signOut({ redirect: false });

      return {
         success: true,
         message: "Passwort erfolgreich geändert",
      };
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

export const deleteUser = async (
   data: DUserAccountDelete
): Promise<ActionResult> => {
   try {
      const user = await requireUser();
      const validatedData = deleteAccountSchema.parse(data);

      await prisma.$transaction(async (tx) => {
         const userService = getUserService(tx);
         await userService.deleteUser(user.id, validatedData);
      });

      await signOut({ redirectTo: "/p" });

      return {
         success: true,
         message: "Konto wurde gelöscht",
      };
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
