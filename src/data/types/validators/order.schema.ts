import z from "zod";

export const checkoutSchema = z.object({
   agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
   }),
});
