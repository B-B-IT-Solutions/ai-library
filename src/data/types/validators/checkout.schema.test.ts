import { ZodError } from "zod";

import { checkoutSchema } from "./checkout.schema";

describe("checkoutSchema tests", () => {
   it("checkoutSchema - data valid - test", async () => {
      const form = { agreeToTerms: true };
      const validatedValues = checkoutSchema.parse(form);
      expect(validatedValues).toEqual(form);
   });

   it("checkoutSchema - data invalid - test", async () => {
      const form = { agreeToTerms: false };
      const fn = () => checkoutSchema.parse(form);
      expect(fn).toThrow(ZodError);
   });
});
