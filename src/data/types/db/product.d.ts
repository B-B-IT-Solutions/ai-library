import {
   BundleItem,
   Product,
   ProductExample,
   ProductFeature,
   ProductInstruction,
   ProductUseCase,
} from "@/generated/prisma/client";

import { PromptTemplateWithCategories } from "./prompt.template";

export type BundleItemWithTemplate = BundleItem & {
   template: PromptTemplateWithCategories | null;
};

export type ProductWithTemplateBundleItems = Product & {
   template: PromptTemplateWithCategories | null;
   bundleItems: BundleItemWithTemplate[];
};

export type ProductWithDetails = ProductWithTemplateBundleItems & {
   features: ProductFeature[];
   useCases: ProductUseCase[];
   examples: ProductExample[];
   instructions: ProductInstruction[];
};
