jest.mock("@/data/services/user");
jest.mock("@/data/services/iubenda");
jest.mock("@/data/services/email");
jest.mock("@/data/actions/auth-utils");
jest.mock("next/dist/client/components/redirect-error");

import { PrismaClient } from "@prisma/client";
import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { requireUser } from "@/data/actions/auth-utils";
import prisma from "@/data/repositories/prisma";
import { UserService, VerificationTokenService } from "@/data/services/user";
import {
   DUserAccountDelete,
   DUserPasswordUpdate,
   DUserSignIn,
   DUserSignUp,
   DUserUpdate,
} from "@/data/types/domain/user";
import { ActionResult } from "@/data/types/utils";

import {
   deleteUser,
   getUserById,
   resendVerificationEmail,
   signInWithCredentials,
   signOutUser,
   signUpUser,
   updatePassword,
   updateUserProfile,
} from "./user.actions";

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

const sSignUpUser = UserService.prototype.signUpUser;
const sIsEmailVerified = UserService.prototype.isEmailVerified;
const sGetUserById = UserService.prototype.getUserById;
const sGetUserByEmail = UserService.prototype.getUserByEmail;
const sUpdateUser = UserService.prototype.updateUser;
const sUpdatePassword = UserService.prototype.updatePassword;
const sDeleteUser = UserService.prototype.deleteUser;

const sSendVerificationEmail =
   VerificationTokenService.prototype.sendVerificationEmail;

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;

const isRedirectErrorMock = isRedirectError as jest.MockedFunction<
   typeof isRedirectError
>;
const signInMock = signIn as jest.MockedFunction<typeof signIn>;
const signOutMock = signOut as jest.MockedFunction<typeof signOut>;

const redirectMock = redirect as jest.MockedFunction<typeof redirect>;

const sSignUpUserMock = sSignUpUser as jest.MockedFunction<typeof sSignUpUser>;
const sIsEmailVerifiedMock = sIsEmailVerified as jest.MockedFunction<
   typeof sIsEmailVerified
>;
const sGetUserByIdMock = sGetUserById as jest.MockedFunction<
   typeof sGetUserById
>;
const sGetUserByEmailMock = sGetUserByEmail as jest.MockedFunction<
   typeof sGetUserByEmail
>;
const sUpdateUserMock = sUpdateUser as jest.MockedFunction<typeof sUpdateUser>;
const sUpdatePasswordMock = sUpdatePassword as jest.MockedFunction<
   typeof sUpdatePassword
>;

const sSendVerificationEmailMock =
   sSendVerificationEmail as jest.MockedFunction<typeof sSendVerificationEmail>;

const sDeleteUserMock = sDeleteUser as jest.MockedFunction<typeof sDeleteUser>;

describe("signUpUser tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      isRedirectErrorMock.mockReset();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("valid form values - redirects to verify-email - test", async () => {
      const data: DUserSignUp = {
         name: "Test 1",
         email: "test1@email.com",
         password: "123456",
         confirmPassword: "123456",
         acceptTerms: true,
      };
      isRedirectErrorMock.mockReturnValue(true);
      redirectMock.mockImplementation(() => {
         throw new Error("NEXT_REDIRECT");
      });

      const fn = () => signUpUser(data);

      await expect(fn).rejects.toThrow(Error);
      expect(sSignUpUserMock).toHaveBeenCalledTimes(1);
      expect(sSignUpUserMock).toHaveBeenCalledWith(data);
      expect(redirectMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).toHaveBeenCalledWith(
         `/auth/verify-email?email=${encodeURIComponent(data.email)}`
      );
      expect(signInMock).not.toHaveBeenCalled();
   });

   it("invalid form values - test", async () => {
      isRedirectErrorMock.mockReturnValue(false);

      const data: DUserSignUp = {
         name: "Test 1",
         email: "email.com",
         password: "123456",
         confirmPassword: "123",
         acceptTerms: true,
      };

      const result = await signUpUser(data);

      const expectedResult = {
         success: false,
         message: "Nutzer konnte nicht registriert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sSignUpUserMock).not.toHaveBeenCalled();
      expect(signInMock).not.toHaveBeenCalled();
      expect(redirectMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
         "Invalid email address\nConfirm password must be at least 6 characters\nPasswords don't match"
      );
   });

   it("error - test", async () => {
      const errorMessage = "DB error";
      const error = new Error(errorMessage);

      sSignUpUserMock.mockRejectedValue(error);
      isRedirectErrorMock.mockReturnValue(false);

      const data: DUserSignUp = {
         name: "Test 1",
         email: "test1@email.com",
         password: "123456",
         confirmPassword: "123456",
         acceptTerms: true,
      };

      const result = await signUpUser(data);

      const expectedResult: ActionResult = {
         success: false,
         message: "Nutzer konnte nicht registriert werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sSignUpUserMock).toHaveBeenCalledTimes(1);
      expect(redirectMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });
});

describe("signInWithCredentials tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   afterEach(() => {
      signInMock.mockReset();
   });

   it("signInWithCredentials - valid email/password - email verified - test", async () => {
      const formData: DUserSignIn = {
         email: "test1@email.com",
         password: "password123",
      };
      sIsEmailVerifiedMock.mockResolvedValue(true);

      const result = await signInWithCredentials(formData);

      const expectedResult = {
         success: true,
         message: "Signed in successfully",
      };

      expect(result).toEqual(expectedResult);
      expect(sIsEmailVerifiedMock).toHaveBeenCalledTimes(1);
      expect(sIsEmailVerifiedMock).toHaveBeenCalledWith(formData.email);
      expect(signInMock).toHaveBeenCalledTimes(1);
      expect(signInMock).toHaveBeenCalledWith("credentials", formData);
   });

   it("signInWithCredentials - email not verified - returns error - test", async () => {
      const formData: DUserSignIn = {
         email: "test1@email.com",
         password: "password123",
      };
      sIsEmailVerifiedMock.mockResolvedValue(false);
      isRedirectErrorMock.mockReturnValue(false);

      const result = await signInWithCredentials(formData);

      expect(result).toEqual({
         success: false,
         message:
            "E-Mail-Adresse nicht bestätigt. Bitte überprüfe dein Postfach.",
         emailNotVerified: true,
      });
      expect(sIsEmailVerifiedMock).toHaveBeenCalledTimes(1);
      expect(signInMock).not.toHaveBeenCalled();
   });

   it("signInWithCredentials - user not found (isEmailVerified null) - proceeds to signIn - test", async () => {
      const formData: DUserSignIn = {
         email: "test1@email.com",
         password: "password123",
      };
      sIsEmailVerifiedMock.mockResolvedValue(null);
      isRedirectErrorMock.mockReturnValue(false);

      const result = await signInWithCredentials(formData);

      expect(signInMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
         success: true,
         message: "Signed in successfully",
      });
   });

   it("signInWithCredentials - invalid email/password - test", async () => {
      const formData: DUserSignIn = {
         email: "test1email.com",
         password: "p123",
      };
      isRedirectErrorMock.mockReturnValue(false);

      const result = await signInWithCredentials(formData);

      const expectedResult = {
         success: false,
         message: "Invalid email or password",
      };

      expect(result).toEqual(expectedResult);
      expect(signInMock).not.toHaveBeenCalled();
   });

   it("signInWithCredentials - redirect error - test", async () => {
      const formData: DUserSignIn = {
         email: "test1@email.com",
         password: "password123",
      };
      sIsEmailVerifiedMock.mockResolvedValue(true);
      const error = new Error("redirect error");
      signInMock.mockRejectedValue(error);
      isRedirectErrorMock.mockReturnValue(true);

      const fn = () => signInWithCredentials(formData);

      await expect(fn).rejects.toThrow(Error);
      expect(signInMock).toHaveBeenCalledTimes(1);
      expect(signInMock).toHaveBeenCalledWith("credentials", formData);
   });
});

describe("signOutUser tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("signOutUser - test", async () => {
      await signOutUser();
      expect(signOutMock).toHaveBeenCalledTimes(1);
      expect(signOutMock).toHaveBeenCalledWith({ redirectTo: "/p" });
   });
});

describe("resendVerificationEmail tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("user not found - test", async () => {
      sIsEmailVerifiedMock.mockResolvedValue(null);

      const email = "test@email.com";
      const result = await resendVerificationEmail(email);

      const expectedResult: ActionResult = {
         success: false,
         message: "E-Mail-Adresse nicht gefunden",
      };

      expect(result).toEqual(expectedResult);
      expect(sIsEmailVerifiedMock).toHaveBeenCalledTimes(1);
      expect(sIsEmailVerifiedMock).toHaveBeenCalledWith(email);
      expect(sGetUserByEmailMock).not.toHaveBeenCalled();
      expect(sSendVerificationEmailMock).not.toHaveBeenCalled();
   });

   it("email already verified - test", async () => {
      sIsEmailVerifiedMock.mockResolvedValue(true);

      const email = "test@email.com";
      const result = await resendVerificationEmail(email);

      const expectedResult: ActionResult = {
         success: false,
         message: "E-Mail-Adresse ist bereits bestätigt",
      };

      expect(result).toEqual(expectedResult);
      expect(sIsEmailVerifiedMock).toHaveBeenCalledTimes(1);
      expect(sIsEmailVerifiedMock).toHaveBeenCalledWith(email);
      expect(sGetUserByEmailMock).not.toHaveBeenCalled();
      expect(sSendVerificationEmailMock).not.toHaveBeenCalled();
   });

   it("user not found by email - test", async () => {
      sIsEmailVerifiedMock.mockResolvedValue(false);
      sGetUserByEmailMock.mockResolvedValue(null);

      const email = "test@email.com";
      const result = await resendVerificationEmail(email);

      const expectedResult: ActionResult = {
         success: false,
         message: "E-Mail-Adresse nicht gefunden",
      };

      expect(result).toEqual(expectedResult);
      expect(sIsEmailVerifiedMock).toHaveBeenCalledTimes(1);
      expect(sIsEmailVerifiedMock).toHaveBeenCalledWith(email);
      expect(sGetUserByEmailMock).toHaveBeenCalledTimes(1);
      expect(sGetUserByEmailMock).toHaveBeenCalledWith(email);
      expect(sSendVerificationEmailMock).not.toHaveBeenCalled();
   });

   it("error - test", async () => {
      const user = dtestData.dUser();
      sIsEmailVerifiedMock.mockResolvedValue(false);
      sGetUserByEmailMock.mockResolvedValue(user);

      const errorMessage = "API Error";
      const error = new Error(errorMessage);
      sSendVerificationEmailMock.mockRejectedValue(error);

      const result = await resendVerificationEmail(user.email);

      const expectedResult: ActionResult = {
         success: false,
         message: "Verifizierungs-E-Mail konnte nicht gesendet werden",
      };

      expect(result).toEqual(expectedResult);
      expect(sIsEmailVerifiedMock).toHaveBeenCalledTimes(1);
      expect(sIsEmailVerifiedMock).toHaveBeenCalledWith(user.email);
      expect(sGetUserByEmailMock).toHaveBeenCalledTimes(1);
      expect(sGetUserByEmailMock).toHaveBeenCalledWith(user.email);
      expect(sSendVerificationEmailMock).toHaveBeenCalledTimes(1);
      expect(sSendVerificationEmailMock).toHaveBeenCalledWith(
         user.email,
         user.name
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(error.message);
   });

   it("success - test", async () => {
      const user = dtestData.dUser();
      sIsEmailVerifiedMock.mockResolvedValue(false);
      sGetUserByEmailMock.mockResolvedValue(user);
      sSendVerificationEmailMock.mockResolvedValue();

      const result = await resendVerificationEmail(user.email);

      const expectedResult: ActionResult = {
         success: true,
         message: "Verifizierungs-E-Mail wurde erneut gesendet",
      };

      expect(result).toEqual(expectedResult);
      expect(sIsEmailVerifiedMock).toHaveBeenCalledTimes(1);
      expect(sIsEmailVerifiedMock).toHaveBeenCalledWith(user.email);
      expect(sGetUserByEmailMock).toHaveBeenCalledTimes(1);
      expect(sGetUserByEmailMock).toHaveBeenCalledWith(user.email);
      expect(sSendVerificationEmailMock).toHaveBeenCalledTimes(1);
      expect(sSendVerificationEmailMock).toHaveBeenCalledWith(
         user.email,
         user.name
      );
   });
});

describe("getUserById tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   it("getUserById - user found - test", async () => {
      const user = dtestData.dUser();
      sGetUserByIdMock.mockResolvedValue(user);

      const result = await getUserById(user.id);

      expect(result).toEqual(user);
      expect(sGetUserByIdMock).toHaveBeenCalledTimes(1);
      expect(sGetUserByIdMock).toHaveBeenCalledWith(user.id);
   });

   it("getUserById - user null - test", async () => {
      sGetUserByIdMock.mockResolvedValue(null);
      const userId = "invalid-id-1";

      const fn = () => getUserById(userId);

      await expect(fn).rejects.toThrow(Error);
      expect(sGetUserByIdMock).toHaveBeenCalledTimes(1);
      expect(sGetUserByIdMock).toHaveBeenCalledWith(userId);
   });
});

describe("updateUserProfile tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      isRedirectErrorMock.mockReset();
   });

   it("updateUserProfile - user undefined - test", async () => {
      requireUserMock.mockRejectedValue("Unknow user");

      const data: DUserUpdate = {
         name: "Test 1",
      };

      const result = await updateUserProfile(data);

      const expectedResult = {
         success: false,
         message: "Fehler beim Aktualisieren des Profils",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdateUserMock).not.toHaveBeenCalled();
   });

   it("updateUserProfile - valid data - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      const data: DUserUpdate = {
         name: "Test 1",
      };

      const result = await updateUserProfile(data);

      const expectedResult = {
         success: true,
         message: "Profil erfolgreich aktualisiert",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdateUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateUserMock).toHaveBeenCalledWith(user.id, data);
   });

   it("updateUserProfile - invalid data - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      const data: DUserUpdate = {
         name: "T",
      };

      const result = await updateUserProfile(data);

      const expectedResult = {
         success: false,
         message: "Fehler beim Aktualisieren des Profils",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdateUserMock).not.toHaveBeenCalled();
   });

   it("updateUserProfile - redirect error - test", async () => {
      const error = new Error("redirect error");
      requireUserMock.mockRejectedValue(error);
      isRedirectErrorMock.mockReturnValue(true);

      const data: DUserUpdate = {
         name: "test 1",
      };

      const fn = () => updateUserProfile(data);

      await expect(fn).rejects.toThrow(Error);
      expect(sUpdateUserMock).not.toHaveBeenCalled();
   });
});

describe("updatePassword tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      isRedirectErrorMock.mockReset();
   });

   it("updatePassword - user undefined - test", async () => {
      requireUserMock.mockRejectedValue("Unknow user");

      const data: DUserPasswordUpdate = {
         currentPassword: "test123",
         newPassword: "12345679",
         confirmPassword: "12345679",
      };

      const result = await updatePassword(data);

      const expectedResult = {
         success: false,
         message: "Fehler beim Ändern des Passworts",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdatePasswordMock).not.toHaveBeenCalled();
      expect(signOutMock).not.toHaveBeenCalled();
   });

   it("updatePassword - valid data - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const data: DUserPasswordUpdate = {
         currentPassword: "test123",
         newPassword: "12345679",
         confirmPassword: "12345679",
      };

      const result = await updatePassword(data);

      const expectedResult = {
         success: true,
         message: "Passwort erfolgreich geändert",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdatePasswordMock).toHaveBeenCalledTimes(1);
      expect(sUpdatePasswordMock).toHaveBeenCalledWith(user.id, data);
      expect(signOutMock).toHaveBeenCalledTimes(1);
      expect(signOutMock).toHaveBeenCalledWith({ redirect: false });
   });

   it("updatePassword - invalid data - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const data: DUserPasswordUpdate = {
         currentPassword: "test123",
         newPassword: "12345679",
         confirmPassword: "test123",
      };

      const result = await updatePassword(data);

      const expectedResult = {
         success: false,
         message: "Fehler beim Ändern des Passworts",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdatePasswordMock).not.toHaveBeenCalled();
      expect(signOutMock).not.toHaveBeenCalled();
   });

   it("updatePassword - redirect error - test", async () => {
      const error = new Error("redirect error");
      requireUserMock.mockRejectedValue(error);
      isRedirectErrorMock.mockReturnValue(true);

      const data: DUserPasswordUpdate = {
         currentPassword: "test123",
         newPassword: "12345679",
         confirmPassword: "test123",
      };

      const fn = () => updatePassword(data);

      await expect(fn).rejects.toThrow(Error);
      expect(sUpdatePasswordMock).not.toHaveBeenCalled();
      expect(signOutMock).not.toHaveBeenCalled();
   });
});

describe("deleteUser tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
      isRedirectErrorMock.mockReset();
   });

   it("deleteUser - user undefined - test", async () => {
      requireUserMock.mockRejectedValue("Unknow user");

      const data: DUserAccountDelete = {
         password: "test123",
      };

      const result = await deleteUser(data);

      const expectedResult = {
         success: false,
         message: "Fehler beim Löschen des Kontos",
      };

      expect(result).toEqual(expectedResult);
      expect(sDeleteUserMock).not.toHaveBeenCalled();
      expect(signOutMock).not.toHaveBeenCalled();
   });

   it("deleteUser - valid data - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const data: DUserAccountDelete = {
         password: "test123",
      };

      const result = await deleteUser(data);

      const expectedResult = {
         success: true,
         message: "Konto wurde gelöscht",
      };

      expect(result).toEqual(expectedResult);
      expect(prismaMock.$transaction).toHaveBeenCalledTimes(1);
      expect(sDeleteUserMock).toHaveBeenCalledTimes(1);
      expect(sDeleteUserMock).toHaveBeenCalledWith(user.id, data);
      expect(signOutMock).toHaveBeenCalledTimes(1);
      expect(signOutMock).toHaveBeenCalledWith({ redirectTo: "/p" });
   });

   it("deleteUser - invalid data - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);

      const data: DUserAccountDelete = {
         password: "",
      };

      const result = await deleteUser(data);

      const expectedResult = {
         success: false,
         message: "Fehler beim Löschen des Kontos",
      };

      expect(result).toEqual(expectedResult);
      expect(sDeleteUserMock).not.toHaveBeenCalled();
      expect(signOutMock).not.toHaveBeenCalled();
   });

   it("deleteUser - redirect error - test", async () => {
      const error = new Error("redirect error");
      requireUserMock.mockRejectedValue(error);
      isRedirectErrorMock.mockReturnValue(true);

      const data: DUserAccountDelete = {
         password: "test123",
      };

      const fn = () => deleteUser(data);

      await expect(fn).rejects.toThrow(Error);
      expect(sDeleteUserMock).not.toHaveBeenCalled();
      expect(signOutMock).not.toHaveBeenCalled();
   });
});
