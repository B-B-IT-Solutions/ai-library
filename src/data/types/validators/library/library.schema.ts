import z from "zod";

export const updateLibraryCollectionSchema = z.object({
   name: z.string().min(1, "Name ist erforderlich").max(250),
   description: z.string().max(750).optional(),
   color: z.string().optional(),
   order: z.number().optional(),
});
