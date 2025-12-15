jest.mock("@/data/db/queries/user");
jest.mock("next/dist/client/components/redirect-error");

import { ptestData } from "@tests";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { signIn, signOut } from "@/auth";
import { createUser, getUser } from "@/data/db/queries/user";
import { DSignInFormData, DSignUpFormData } from "@/data/types/domain/user";
import { Prisma } from "@/generated/prisma/client";
import { hash } from "@/lib/encrypt";

import {
   getUserById,
   signInWithCredentials,
   signOutUser,
   signUpUser,
} from "./user.actions";

const isRedirectErrorock = isRedirectError as jest.MockedFunction<
   typeof isRedirectError
>;
const signInMock = signIn as jest.MockedFunction<typeof signIn>;
const signOutMock = signOut as jest.MockedFunction<typeof signOut>;

const getUserMock = getUser as jest.MockedFunction<typeof getUser>;
const createUserMock = createUser as jest.MockedFunction<typeof createUser>;

describe("signInWithCredentials tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("signInWithCredentials - valid email/password - test", async () => {
      const formData: DSignInFormData = {
         email: "test1@email.com",
         password: "password123",
      };

      const result = await signInWithCredentials(formData);

      const expectedResult = {
         success: true,
         message: "Signed in successfully",
      };

      expect(result).toEqual(expectedResult);
      expect(signInMock).toHaveBeenCalledTimes(1);
      expect(signInMock).toHaveBeenCalledWith("credentials", formData);
   });

   it("signInWithCredentials - invalid email/password - test", async () => {
      const formData: DSignInFormData = {
         email: "test1email.com",
         password: "p123",
      };
      isRedirectErrorock.mockReturnValue(false);

      const result = await signInWithCredentials(formData);

      const expectedResult = {
         success: false,
         message: "Invalid email or password",
      };

      expect(result).toEqual(expectedResult);
      expect(signInMock).not.toHaveBeenCalled();
   });

   it("signInWithCredentials - redirect error - test", async () => {
      const formData: DSignInFormData = {
         email: "test1@email.com",
         password: "password123",
      };
      const error = new Error("redirect error");
      signInMock.mockRejectedValue(error);
      isRedirectErrorock.mockReturnValue(true);

      const fn = () => signInWithCredentials(formData);

      await expect(fn).rejects.toThrow(Error);
      expect(signInMock).toHaveBeenCalledTimes(1);
      expect(signInMock).toHaveBeenCalledWith("credentials", formData);
   });
});

describe("signOutUser tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("signOutUser - test", async () => {
      await signOutUser();
      expect(signOutMock).toHaveBeenCalledTimes(1);
   });
});

describe("signUpUser tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("signUpUser - valid form values - test", async () => {
      const formData: DSignUpFormData = {
         name: "Test 1",
         email: "test1@email.com",
         password: "123456",
         confirmPassword: "123456",
      };
      const result = await signUpUser(formData);

      const expectedResult = {
         success: true,
         message: "User registered successfully",
      };

      const newUser: Prisma.UserCreateInput = {
         name: formData.name,
         email: formData.email,
         password: await hash(formData.password),
      };

      const expectedSignInData = {
         email: formData.email,
         password: formData.password,
      };
      expect(result).toEqual(expectedResult);
      expect(createUserMock).toHaveBeenCalledTimes(1);
      expect(createUserMock).toHaveBeenCalledWith(newUser);
      expect(signInMock).toHaveBeenCalledTimes(1);
      expect(signInMock).toHaveBeenCalledWith(
         "credentials",
         expectedSignInData
      );
   });

   it("signUpUser - invalid form values - test", async () => {
      const formData: DSignUpFormData = {
         name: "Test 1",
         email: "email.com",
         password: "123456",
         confirmPassword: "123",
      };
      isRedirectErrorock.mockReturnValue(false);

      const result = await signUpUser(formData);

      const expectedResult = {
         success: false,
         message:
            "Invalid email address\nConfirm password must be at least 6 characters\nPasswords don't match",
      };

      expect(result).toEqual(expectedResult);
      expect(createUserMock).not.toHaveBeenCalled();
      expect(signInMock).not.toHaveBeenCalled();
   });

   it("signUpUser - redirect error - test", async () => {
      const signUpData: DSignUpFormData = {
         name: "Test 1",
         email: "test1@email.com",
         password: "123456",
         confirmPassword: "123456",
      };

      const error = new Error("redirect error");
      signInMock.mockRejectedValue(error);
      isRedirectErrorock.mockReturnValue(true);

      const fn = () => signUpUser(signUpData);

      const newUser: Prisma.UserCreateInput = {
         name: signUpData.name,
         email: signUpData.email,
         password: await hash(signUpData.password),
      };

      const expectedSignInData = {
         email: signUpData.email,
         password: signUpData.password,
      };

      await expect(fn).rejects.toThrow(Error);
      expect(createUserMock).toHaveBeenCalledTimes(1);
      expect(createUserMock).toHaveBeenCalledWith(newUser);
      expect(signInMock).toHaveBeenCalledTimes(1);
      expect(signInMock).toHaveBeenCalledWith(
         "credentials",
         expectedSignInData
      );
   });
});

describe("getUserById tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getUserById - user found - test", async () => {
      const user = ptestData.pUser();
      getUserMock.mockResolvedValue(user);

      const result = await getUserById(user.id);

      expect(result).toEqual(user);
      expect(getUserMock).toHaveBeenCalledTimes(1);
      expect(getUserMock).toHaveBeenCalledWith(user.id);
   });

   it("getUserById - user null - test", async () => {
      getUserMock.mockResolvedValue(null);
      const userId = "invalid-id-1";

      const fn = () => getUserById(userId);

      await expect(fn).rejects.toThrow(Error);
      expect(getUserMock).toHaveBeenCalledTimes(1);
      expect(getUserMock).toHaveBeenCalledWith(userId);
   });
});
