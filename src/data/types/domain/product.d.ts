import { Filter, Page, PageQuery } from "@/data/types/common";

import { DPromptTemplate } from "./prompt.template";

export type DProductsPageQuery = PageQuery<DProductsFilter>;
export type DProductsPage = Page<DProduct>;

export interface DProductsFilter extends Filter {
   type?: DProductType;
   status?: DProductStatus;
   minPrice?: number;
   maxPrice?: number;
}

export type DProductViewMode = "grid" | "list";

export type DProductType = "TEMPLATE" | "BUNDLE";
export type DProductStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type DProduct = {
   id: string;
   name: string;
   description: string;
   price: number;
   discountAmount: number | null;
   type: DProductType;
   status: DProductStatus;
   productItems: DProductItem[];
   features: DFeature[];
   useCases: DUseCase[];
   examples: DExample[];
   instructions: DInstruction[];
   createdAt: string;
   updatedAt: string;
};

export type DFeature = {
   icon: string;
   title: string;
   description: string;
};

export type DUseCase = {
   category: string;
   description: string;
   tags: string[];
};

export type DExample = {
   title: string;
   content: string;
};

export type DInstruction = {
   step: number;
   title: string;
   description: string;
};

export type DProductItem = {
   id: string;
   productId: string;
   templateId: string;
   template: DPromptTemplate;
   createdAt: string;
};
