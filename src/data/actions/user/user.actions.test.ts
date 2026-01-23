jest.mock("@/data/services/user");
jest.mock("next/dist/client/components/redirect-error");

import { dtestData } from "@tests";
import { isRedirectError } from "next/dist/client/components/redirect-error";

import { signIn, signOut } from "@/auth";
import { UserService } from "@/data/services/user";
import {
   DUserSignIn,
   DUserSignUp,
   DUserUpdateData,
} from "@/data/types/domain/user";

import {
   getUserByEmail,
   getUserById,
   signInWithCredentials,
   signOutUser,
   signUpUser,
   updateUserProfile,
} from "./user.actions";

const sSignUpUser = UserService.prototype.signUpUser;
const sGetUserById = UserService.prototype.getUserById;
const sGetUserByEmail = UserService.prototype.getUserByEmail;
const sUpdateUser = UserService.prototype.updateUser;

const isRedirectErrorock = isRedirectError as jest.MockedFunction<
   typeof isRedirectError
>;
const signInMock = signIn as jest.MockedFunction<typeof signIn>;
const signOutMock = signOut as jest.MockedFunction<typeof signOut>;

const sSignUpUserMock = sSignUpUser as jest.MockedFunction<typeof sSignUpUser>;

const sGetUserByIdMock = sGetUserById as jest.MockedFunction<
   typeof sGetUserById
>;

const sGetUserByEmailMock = sGetUserByEmail as jest.MockedFunction<
   typeof sGetUserByEmail
>;

const sUpdateUserMock = sUpdateUser as jest.MockedFunction<typeof sUpdateUser>;

describe("signInWithCredentials tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("signInWithCredentials - valid email/password - test", async () => {
      const formData: DUserSignIn = {
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
      const formData: DUserSignIn = {
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
      const formData: DUserSignIn = {
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
      expect(signOutMock).toHaveBeenCalledWith({ redirectTo: "/p" });
   });
});

describe("signUpUser tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("signUpUser - valid form values - test", async () => {
      const data: DUserSignUp = {
         name: "Test 1",
         email: "test1@email.com",
         password: "123456",
         confirmPassword: "123456",
      };
      const result = await signUpUser(data);

      const expectedResult = {
         success: true,
         message: "User registered successfully",
      };

      const expectedSignInData = {
         email: data.email,
         password: data.password,
      };
      expect(result).toEqual(expectedResult);
      expect(sSignUpUserMock).toHaveBeenCalledTimes(1);
      expect(sSignUpUserMock).toHaveBeenCalledWith(data);
      expect(signInMock).toHaveBeenCalledTimes(1);
      expect(signInMock).toHaveBeenCalledWith(
         "credentials",
         expectedSignInData
      );
   });

   it("signUpUser - invalid form values - test", async () => {
      const data: DUserSignUp = {
         name: "Test 1",
         email: "email.com",
         password: "123456",
         confirmPassword: "123",
      };
      isRedirectErrorock.mockReturnValue(false);

      const result = await signUpUser(data);

      const expectedResult = {
         success: false,
         message:
            "Invalid email address\nConfirm password must be at least 6 characters\nPasswords don't match",
      };

      expect(result).toEqual(expectedResult);
      expect(sSignUpUserMock).not.toHaveBeenCalled();
      expect(signInMock).not.toHaveBeenCalled();
   });

   it("signUpUser - redirect error - test", async () => {
      const data: DUserSignUp = {
         name: "Test 1",
         email: "test1@email.com",
         password: "123456",
         confirmPassword: "123456",
      };

      const error = new Error("redirect error");
      signInMock.mockRejectedValue(error);
      isRedirectErrorock.mockReturnValue(true);

      const fn = () => signUpUser(data);

      const expectedSignInData = {
         email: data.email,
         password: data.password,
      };

      await expect(fn).rejects.toThrow(Error);
      expect(sSignUpUserMock).toHaveBeenCalledTimes(1);
      expect(sSignUpUserMock).toHaveBeenCalledWith(data);
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

describe("getUserByEmail tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("getUserByEmail - user found - test", async () => {
      const user = dtestData.dUser();
      sGetUserByEmailMock.mockResolvedValue(user);

      const result = await getUserByEmail(user.email);

      expect(result).toEqual(user);
      expect(sGetUserByEmailMock).toHaveBeenCalledTimes(1);
      expect(sGetUserByEmailMock).toHaveBeenCalledWith(user.email);
   });

   it("getUserByEmail - user null - test", async () => {
      sGetUserByEmailMock.mockResolvedValue(null);
      const email = "invalid-email-1";

      const result = await getUserByEmail(email);

      expect(result).toBeNull();
      expect(sGetUserByEmailMock).toHaveBeenCalledTimes(1);
      expect(sGetUserByEmailMock).toHaveBeenCalledWith(email);
   });
});

describe("updateUserProfile tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   test("updateUserProfile - user updated - test", async () => {
      const userId = "user-id-1";
      const data = dtestData.dUserUpdateData();

      await updateUserProfile(userId, data);

      expect(sUpdateUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateUserMock).toHaveBeenCalledWith(userId, data);
   });

   it("updateUserProfile - valid data - test", async () => {
      const userId = "user-id-1";
      const data: DUserUpdateData = {
         name: "Test 1",
      };

      const result = await updateUserProfile(userId, data);

      const expectedResult = {
         success: true,
         message: "User profile updated successfully",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdateUserMock).toHaveBeenCalledTimes(1);
      expect(sUpdateUserMock).toHaveBeenCalledWith(userId, data);
   });

   it("updateUserProfile - invalid data - test", async () => {
      const userId = "user-id-1";
      const data: DUserUpdateData = {
         name: "T",
      };

      const result = await updateUserProfile(userId, data);

      const expectedResult = {
         success: false,
         message: "Name must be at least 3 characters",
      };

      expect(result).toEqual(expectedResult);
      expect(sUpdateUserMock).not.toHaveBeenCalled();
   });
});
