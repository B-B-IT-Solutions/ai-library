import z from "zod";

export const productFilterSchema = z.object({
   search: z.string().optional(),
   type: z.enum(["TEMPLATE", "BUNDLE"]).optional(),
   status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
   minPrice: z.number().min(0).optional(),
   maxPrice: z.number().min(0).optional(),
   categories: z.array(z.string()).optional(),
});
