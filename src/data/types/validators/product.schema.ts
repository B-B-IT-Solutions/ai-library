import z from "zod";

export const productFilterSchema = z.object({
   search: z.string().optional(),
   type: z.enum(["TEMPLATE", "BUNDLE", "SUBSCRIPTION"]).optional(),
   status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
   minPrice: z.number().min(0).optional(),
   maxPrice: z.number().min(0).optional(),
   categories: z.array(z.string()).optional(),
});

export const addToCartSchema = z.object({
   productId: z.string().uuid("Invalid product ID"),
   quantity: z.number().int().positive().default(1),
});

export const updateCartItemSchema = z.object({
   quantity: z.number().int().positive("Quantity must be at least 1"),
});
