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
   it("signUpSchema - data valid - test", async () => {
      const formData: DUserSignUp = {
         name: "Test 1",
         email: "test1@email.com",
         password: "123456",
         confirmPassword: "123456",
      };

      const validatedValues = signUpSchema.parse(formData);
      expect(validatedValues).toEqual(formData);
   });

   it("signUpSchema - data invalid - test", async () => {
      const formData: DUserSignUp = {
         name: "Test 1",
         email: "email.com",
         password: "123456",
         confirmPassword: "123",
      };

      const fn = () => signUpSchema.parse(formData);
      expect(fn).toThrow(ZodError);
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
