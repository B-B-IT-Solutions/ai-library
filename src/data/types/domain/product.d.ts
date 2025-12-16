import z from "zod";

import { Filter, Page, PageQuery } from "@/data/types/common";
import { addToCartSchema } from "@/data/types/validators/product.schema";

import { DPromptTemplate } from "./prompt.template";

export type DProductType = "TEMPLATE" | "BUNDLE" | "SUBSCRIPTION";
export type DProductStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type DProduct = {
   id: string;
   name: string;
   description: string;
   price: number;
   type: DProductType;
   status: DProductStatus;
   templateId?: string;
   template?: DPromptTemplate;
   subscriptionDuration?: number;
   bundleItems?: DPromptTemplate[];
   createdAt: string;
   updatedAt: string;
};

export type DBundle = DProduct & {
   type: "BUNDLE";
   bundleItems: DPromptTemplate[];
};

export type DSubscriptionPlan = DProduct & {
   type: "SUBSCRIPTION";
   subscriptionDuration: number;
};

export type DProductsPageQuery = PageQuery<DProductsFilter>;
export type DProductsPage = Page<DProduct>;

export interface DProductsFilter extends Filter {
   type?: DProductType;
   status?: DProductStatus;
   minPrice?: number;
   maxPrice?: number;
}

export type DAddToCart = z.infer<typeof addToCartSchema>;
