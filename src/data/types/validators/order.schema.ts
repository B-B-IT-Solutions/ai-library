import z from "zod";

export const checkoutSchema = z.object({
   agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
   }),
});

export const paymentMethodSchema = z.object({
   type: z.enum(["CREDIT_CARD", "PAYPAL", "STRIPE"]),
   identifier: z.string().min(1, "Payment method identifier is required"),
   isDefault: z.boolean().default(false),
});
