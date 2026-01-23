import { ZodError } from "zod";

import { DUserSignIn, DUserSignUp } from "@/data/types/domain/user";

import { signInSchema, signUpSchema } from "./user.schema";

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
