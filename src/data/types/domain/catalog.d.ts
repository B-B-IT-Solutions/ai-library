import { Page, PageQuery } from "@/data/types/common";
import { DPromptVariableType } from "@/data/types/domain/prompt";

export type DCatalogEntriesPageQuery = PageQuery<DCatalogEntriesFilter>;
export type DCatalogEntriesPage = Page<DCatalogEntry>;

export type DCatalogEntriesFilter = {
   search?: string;
   categories?: string[];
};

export type DCatalogEntry = {
   id: string;
   slug: string;
   title: string;
   description: string;
   recommendedModel: string;
   status: DCatalogEntryStatus;
   category: DCatalogEntryCategory | null;
   fields: DCatalogEntryField[];
   copyCount: number;
   publishedAt: string | null;
   createdAt: string;
   updatedAt: string;
};

export type DCatalogEntryWithContent = DCatalogEntry & {
   content: string;
};

export type DCatalogEntryStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type DCatalogEntryCategory = {
   id: string;
   name: string;
   slug: string;
   description: string | null;
   order: number;
};

export type DCatalogEntryField = {
   id: string;
   catalogEntryId: string;
   name: string;
   label: string;
   description: string | null;
   type: DPromptVariableType;
   required: boolean;
   order: number;
   defaultValue: string | null;
   options?: string[];
};

export type DCatalogEntryCopyResult = {
   templateId: string;
};

export type DCatalogEntrySitemapData = Pick<
   DCatalogEntry,
   "slug" | "updatedAt"
>;
