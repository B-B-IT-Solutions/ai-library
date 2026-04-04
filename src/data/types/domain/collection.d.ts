import z from "zod";

import { updateCollectionSchema } from "@/data/types/validators/library";

export type DCollectionUpdate = z.infer<typeof updateCollectionSchema>;

export type DCollection = {
   id: string;
   userId: string;
   name: string;
   description: string | null;
   color: string | null;
   order: number;
   isPublic: boolean;
   shareToken: string | null;
   templateCount: number;
   createdAt: string;
   updatedAt: string;
};
