import { PromptWithCategories } from "@/data/types/db/prompt";
import {
   Product,
   ProductExample,
   ProductFeature,
   ProductInstruction,
   ProductItem,
   ProductUseCase,
} from "@/generated/prisma/client";

export type ProductItemWithTemplate = ProductItem & {
   template: PromptWithCategories;
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

export type ProductSitemapData = Pick<Product, "id" | "updatedAt">;
