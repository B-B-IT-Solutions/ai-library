import { Page, Pagination } from "@/data/types/common";
import { DPromptTemplateFieldType } from "@/data/types/domain/prompt.template";

export type DCatalogEntriesPage = Page<DCatalogEntrySummary>;

export type DCatalogEntriesFilter = {
   search?: string;
   categorySlug?: string;
};

export type DCatalogEntriesPageQuery = {
   pagination?: Pagination;
   sort?: DExploreSortMode;
   filter?: DCatalogEntriesFilter;
};

export type DCatalogEntry = {
   id: string;
   slug: string;
   title: string;
   description: string;
   recommendedModel: string;
   content: string;
   status: DCatalogEntryStatus;
   category: DCatalogEntryCategory | null;
   fields: DCatalogEntryField[];
   copyCount: number;
   publishedAt: string | null;
   createdAt: string;
   updatedAt: string;
};

export type DCatalogEntrySummary = Omit<DCatalogEntry, "content">;

export type DCatalogEntryStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type DExploreSortMode = "newest" | "popular";

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
   type: DPromptTemplateFieldType;
   required: boolean;
   order: number;
   defaultValue: string | null;
   options?: string[];
};

export type DCatalogEntryCopyResult = {
   templateId: string;
};
