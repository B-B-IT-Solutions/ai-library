import { ZodError } from "zod";

import {
   DUserPasswordUpdate,
   DUserSignIn,
   DUserSignUp,
} from "@/data/types/domain/user";

import {
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
      const validatedValues = signUpSchema.parse(validFormData);
      expect(validatedValues).toEqual(validFormData);
   });

   it("signUpSchema - data invalid - invalid email and mismatched passwords - test", async () => {
      const formData: DUserSignUp = {
         name: "Test 1",
         email: "email.com",
         password: "123456",
         confirmPassword: "123",
         acceptTerms: true,
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
      const invalidFormData = validFormData;
      invalidFormData.acceptTerms = undefined as unknown as boolean;

      const fn = () => signUpSchema.parse(invalidFormData);
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
