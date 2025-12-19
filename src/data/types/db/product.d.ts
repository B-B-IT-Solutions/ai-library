import { PromptTemplateWithCategories } from "@/data/types/db/prompt.template";
import { Product } from "@/generated/prisma/client";

export type ProductWithTemplateBundleItems = Product & {
   template: PromptTemplateWithCategories;
   bundleItems: PromptTemplateWithCategories[];
};
