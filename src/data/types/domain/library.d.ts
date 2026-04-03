import z from "zod";

import { updateLibraryCollectionSchema } from "@/data/types/validators/library";

export type DLibraryCollectionUpdate = z.infer<
   typeof updateLibraryCollectionSchema
>;

export type DLibraryCollection = {
   id: string;
   userId: string;
   name: string;
   description: string | null;
   color: string | null;
   order: number;
   createdAt: string;
   updatedAt: string;
};
