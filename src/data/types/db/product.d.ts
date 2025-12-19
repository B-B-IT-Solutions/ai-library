import { BundleItem, Product } from "@/generated/prisma/client";

import { PromptTemplateWithCategories } from "./prompt.template";

export type BundleItemWithTemplate = BundleItem & {
   template: PromptTemplateWithCategories | null;
};

export type ProductWithTemplateBundleItems = Product & {
   template: PromptTemplateWithCategories | null;
   bundleItems: BundleItemWithTemplate[];
};
