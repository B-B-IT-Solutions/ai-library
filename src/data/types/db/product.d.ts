import { PromptTemplateDescriptorWithCategories } from "@/data/types/db/prompt.template";
import {
   Product,
   ProductExample,
   ProductFeature,
   ProductInstruction,
   ProductItem,
   ProductUseCase,
} from "@/generated/prisma/client";

export type ProductItemWithTemplate = ProductItem & {
   template: PromptTemplateDescriptorWithCategories;
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
