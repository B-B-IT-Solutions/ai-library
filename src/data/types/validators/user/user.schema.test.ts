import { ZodError } from "zod";

import {
   DForgotPassword,
   DResetPassword,
   DUserPasswordUpdate,
   DUserSignIn,
   DUserSignUp,
} from "@/data/types/domain/user";

import {
   forgotPasswordSchema,
   resetPasswordSchema,
   signInSchema,
   signUpSchema,
   updatePasswordSchema,
} from "./user.schema";

describe("signInSchema tests", () => {
   it("signInSchema - data valid - test", async () => {
      const formData: DUserSignIn = {
         email: "test1@email.com",
         password: "123456",
      };

      const validatedValues = signInSchema.parse(formData);
      expect(validatedValues).toEqual(formData);
   });

   it("signInSchema - data invalid - test", async () => {
      const formData: DUserSignIn = {
         email: "email.com",
         password: "123456",
      };

      const fn = () => signInSchema.parse(formData);
      expect(fn).toThrow(ZodError);
   });
});

describe("signUpSchema tests", () => {
   const validFormData: DUserSignUp = {
      name: "Test 1",
      email: "test1@email.com",
      password: "123456",
      confirmPassword: "123456",
      acceptTerms: true,
   };

   it("signUpSchema - data valid - test", async () => {
      const formData = { ...validFormData };

      const validatedValues = signUpSchema.parse(formData);
      expect(validatedValues).toEqual(validFormData);
   });

   it("signUpSchema - data invalid - test", async () => {
      const formData = {
         ...validFormData,
         email: "email.com",
         confirmPassword: "123",
      };

      const fn = () => signUpSchema.parse(formData);
      expect(fn).toThrow(ZodError);
   });

   it("signUpSchema - acceptTerms false - test", () => {
      const formData = { ...validFormData, acceptTerms: false };

      const fn = () => signUpSchema.parse(formData);
      expect(fn).toThrow(ZodError);
      expect(fn).toThrow("acceptTerms");
      expect(fn).toThrow(
         "Sie müssen die AGB und Datenschutzerklärung akzeptieren"
      );
   });

   it("signUpSchema - acceptTerms missing - test", () => {
      const formData = { ...validFormData, acceptTerms: undefined };

      const fn = () => signUpSchema.parse(formData);
      expect(fn).toThrow(ZodError);
      expect(fn).toThrow("acceptTerms");
      expect(fn).toThrow("Invalid input: expected boolean, received undefined");
   });
});

describe("updatePasswordSchema tests", () => {
   it("updatePasswordSchema - data valid - test", async () => {
      const formData: DUserPasswordUpdate = {
         currentPassword: "123456",
         newPassword: "789456",
         confirmPassword: "789456",
      };

      const validatedValues = updatePasswordSchema.parse(formData);
      expect(validatedValues).toEqual(formData);
   });

   it("updatePasswordSchema - data invalid - password not updated - test", async () => {
      const formData: DUserPasswordUpdate = {
         currentPassword: "123456",
         newPassword: "123456",
         confirmPassword: "123456",
      };

      const fn = () => updatePasswordSchema.parse(formData);
      expect(fn).toThrow(ZodError);
   });

   it("updatePasswordSchema - data invalid - passwords different - test", async () => {
      const formData: DUserPasswordUpdate = {
         currentPassword: "123456",
         newPassword: "789456",
         confirmPassword: "123456",
      };

      const fn = () => updatePasswordSchema.parse(formData);
      expect(fn).toThrow(ZodError);
   });

   it("updatePasswordSchema - data invalid - password not long enough - test", async () => {
      const formData: DUserPasswordUpdate = {
         currentPassword: "123456",
         newPassword: "78945",
         confirmPassword: "78945",
      };

      const fn = () => updatePasswordSchema.parse(formData);
      expect(fn).toThrow(ZodError);
   });
});

describe("forgotPasswordSchema tests", () => {
   it("valid email - test", () => {
      const data: DForgotPassword = { email: "test@email.com" };
      expect(forgotPasswordSchema.parse(data)).toEqual(data);
   });

   it("invalid email - test", () => {
      const fn = () => forgotPasswordSchema.parse({ email: "not-an-email" });
      expect(fn).toThrow(ZodError);
   });
});

describe("resetPasswordSchema tests", () => {
   it("valid passwords - test", () => {
      const data: DResetPassword = {
         password: "newpass1",
         confirmPassword: "newpass1",
      };
      expect(resetPasswordSchema.parse(data)).toEqual(data);
   });

   it("passwords do not match - test", () => {
      const fn = () =>
         resetPasswordSchema.parse({
            password: "newpass1",
            confirmPassword: "different",
         });
      expect(fn).toThrow(ZodError);
   });

   it("password too short - test", () => {
      const fn = () =>
         resetPasswordSchema.parse({
            password: "abc",
            confirmPassword: "abc",
         });
      expect(fn).toThrow(ZodError);
   });
});
