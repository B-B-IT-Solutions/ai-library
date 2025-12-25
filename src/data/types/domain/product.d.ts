import { Filter, Page, PageQuery } from "@/data/types/common";

import type {
   Example,
   Feature,
   Instruction,
   UseCase,
} from "./product-metadata";
import { DPromptTemplate } from "./prompt.template";

type DProductViewMode = "grid" | "list";

export type DProductType = "TEMPLATE" | "BUNDLE";
export type DProductStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type DProduct = {
   id: string;
   name: string;
   description: string;
   price: number;
   savingsAmount: number | null;
   savingsPercentage: number | null;
   // Bundle-specific fields
   totalIndividualPrice: number | null;
   type: DProductType;
   status: DProductStatus;
   templateId: string | null;
   template?: DPromptTemplate;
   bundleItems?: DBundleItem[];
   features: Feature[] | null;
   useCases: UseCase[] | null;
   examples: Example[] | null;
   instructions: Instruction[] | null;
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
