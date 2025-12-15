import { ZodError } from "zod";

import { DSignUpFormData } from "@/data/types/domain/user";

import { signUpFormSchema } from "./user.schema";

describe("signUpFormSchema tests", () => {
   it("signUpFormSchema - form data valid - test", async () => {
      const formData: DSignUpFormData = {
         name: "Test 1",
         email: "test1@email.com",
         password: "123456",
         confirmPassword: "123456",
      };

      const validatedValues = signUpFormSchema.parse(formData);
      expect(validatedValues).toEqual(formData);
   });

   it("signUpFormSchema - form data invalid - test", async () => {
      const formData: DSignUpFormData = {
         name: "Test 1",
         email: "email.com",
         password: "123456",
         confirmPassword: "123",
      };

      const fn = () => signUpFormSchema.parse(formData);
      expect(fn).toThrow(ZodError);
   });
});
