import z from "zod";

import { updateCollectionSchema } from "@/data/types/validators/collection";
import { Page, PageQuery } from "../common";

export type DCollectionsPageQuery = PageQuery<DCollectionsFilter>;
export type DCollectionsPage = Page<DCollection>;

export type DCollectionsFilter = {
   search?: string;
};

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

export type DCollectionPreview = Pick<DCollection, "id" | "name" | "color">;

export type DCollectionEntry = {
   collectionId: string;
   promptId: string;
   addedAt: string;
};

export type DCollectionUpdate = z.infer<typeof updateCollectionSchema>;
