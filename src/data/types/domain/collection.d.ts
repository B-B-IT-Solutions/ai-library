import z from "zod";

import { updateCollectionSchema } from "@/data/types/validators/collection";

export type DCollectionUpdate = z.infer<typeof updateCollectionSchema>;

export type DCollection = {
   id: string;
   userId: string;
   name: string;
   description: string | null;
   color: string;
   order: number;
   isPublic: boolean;
   publicToken: string | null;
   templateCount: number;
   createdAt: string;
   updatedAt: string;
};

export type DCollectionPreview = {
   id: string;
   name: string;
   color: string;
};

export type DCollectionEntry = {
   collectionId: string;
   promptId: string;
   addedAt: string;
};
