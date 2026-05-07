"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import {
   DForgotPassword,
   DResetPassword,
   DSignUpResult,
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
   forgotPasswordSchema,
   resetPasswordSchema,
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

      return redirect(
         `/auth/verify-email?email=${encodeURIComponent(validatedData.email)}`
      );
   } catch (error) {
      console.error(formatError(error));
      if (isRedirectError(error)) {
         throw error;
      }
      return {
         success: false,
         message: "Nutzer konnte nicht registriert werden",
      };
   }
};

export const signInWithCredentials = async (
   data: DUserSignIn
): Promise<ActionResult<DSignUpResult>> => {
   try {
      const singInValues = signInSchema.parse(data);

      const service = getUserService();
      const isVerified = await service.isEmailVerified(singInValues.email);
      if (isVerified === false) {
         return {
            success: false,
            message:
               "E-Mail-Adresse nicht bestätigt. Bitte überprüfe dein Postfach.",
            data: {
               emailNotVerified: true,
            },
         };
      }

      await signIn("credentials", singInValues);

      return {
         success: true,
         message: "Signed in successfully",
      };
   } catch (error) {
      if (isRedirectError(error)) {
         console.error(formatError(error));
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

export const resendVerificationEmail = async (
   email: string
): Promise<ActionResult> => {
   try {
      const userService = getUserService();
      const isVerified = await userService.isEmailVerified(email);

      if (isVerified === null) {
         return {
            success: false,
            message: "E-Mail-Adresse nicht gefunden",
         };
      }

      if (isVerified === true) {
         return {
            success: false,
            message: "E-Mail-Adresse ist bereits bestätigt",
         };
      }

      const user = await userService.getUserByEmail(email);
      if (!user) {
         return {
            success: false,
            message: "E-Mail-Adresse nicht gefunden",
         };
      }

      const tokenService = getEmailVerificationService();
      await tokenService.sendVerificationEmail(user.email, user.name);

      return {
         success: true,
         message: "Verifizierungs-E-Mail wurde erneut gesendet",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Verifizierungs-E-Mail konnte nicht gesendet werden",
      };
   }
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

      const service = getUserService();
      await service.updatePassword(user.id, validatedData);

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
         const service = getUserService(tx);
         await service.deleteUser(user.id, validatedData);
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

export const requestPasswordReset = async (
   data: DForgotPassword
): Promise<ActionResult> => {
   try {
      const { email } = forgotPasswordSchema.parse(data);

      const userService = getUserService();
      await userService.requestPasswordReset(email);

      return {
         success: true,
         message:
            "Falls ein Konto mit dieser E-Mail existiert, wurde eine E-Mail gesendet.",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message: "Fehler beim Senden der E-Mail",
      };
   }
};

export const resetPassword = async (
   email: string,
   token: string,
   data: DResetPassword
): Promise<ActionResult> => {
   try {
      const validatedData = resetPasswordSchema.parse(data);

      const userService = getUserService();
      await userService.resetPassword(email, token, validatedData);

      return {
         success: true,
         message: "Passwort erfolgreich zurückgesetzt",
      };
   } catch (error) {
      console.error(formatError(error));
      return {
         success: false,
         message:
            "Fehler beim Zurücksetzen des Passworts. Der Link ist möflicherweise ungültig oder abgelaufen. Bitte fordere einen neuen an.",
      };
   }
};

const getUserService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getUserService();
};

const getEmailVerificationService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getVerificationTokenService();
};
