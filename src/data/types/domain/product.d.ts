import z from "zod";

import { Filter, Page, PageQuery } from "@/data/types/common";

import { DPromptTemplate } from "./prompt.template";

type DProductViewMode = "grid" | "list";

export type DProductType = "TEMPLATE" | "BUNDLE";
export type DProductStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type DProduct = {
   id: string;
   name: string;
   description: string;
   price: number;
   type: DProductType;
   status: DProductStatus;
   templateId: string | null;
   template?: DPromptTemplate;
   bundleItems?: DBundleItem[];
   createdAt: string;
   updatedAt: string;
};

export type DBundleItem = {
   id: string;
   bundleId: string;
   templateId: string | null;
   template: DPromptTemplate | null;
   createdAt: string;
};

export type DProductsPageQuery = PageQuery<DProductsFilter>;
export type DProductsPage = Page<DProduct>;

export interface DProductsFilter extends Filter {
   type?: DProductType;
   status?: DProductStatus;
   minPrice?: number;
   maxPrice?: number;
}
