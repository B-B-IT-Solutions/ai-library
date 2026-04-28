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

export type DTemplateCollectionEntry = {
   collectionId: string;
   templateDescriptorId: string;
   addedAt: string;
};
