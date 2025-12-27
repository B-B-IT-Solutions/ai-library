import {
   Product,
   ProductExample,
   ProductFeature,
   ProductInstruction,
   ProductItem,
   ProductUseCase,
} from "@/generated/prisma/client";

import { PromptTemplateWithCategories } from "./prompt.template";

export type ProductItemWithTemplate = ProductItem & {
   template: PromptTemplateWithCategories | null;
};

export type ProductWithItems = Product & {
   productItems: ProductItemWithTemplate[];
};

export type ProductWithDetails = ProductWithItems & {
   features: ProductFeature[];
   useCases: ProductUseCase[];
   examples: ProductExample[];
   instructions: ProductInstruction[];
};
