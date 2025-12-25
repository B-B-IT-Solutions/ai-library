import { isEmpty, map } from "es-toolkit/compat";

import { toDPromptTemplate } from "@/data/actions/prompt/prompt.mapper";
import {
   BundleItemWithTemplate,
   ProductWithTemplateBundleItems,
} from "@/data/types/db/product";
import { DProduct } from "@/data/types/domain/product";

export const toDProducts = (
   pProducts: ProductWithTemplateBundleItems[]
): DProduct[] => {
   return map(pProducts, (p) => toDProduct(p));
};

export const toDProduct = (
   product: ProductWithTemplateBundleItems
): DProduct => {
   const dProduct: DProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price.toFixed(2)),
      savingsAmount: product.savingsAmount
         ? Number(product.savingsAmount.toFixed(2))
         : null,
      savingsPercentage: product.savingsPercentage
         ? Number(product.savingsPercentage.toFixed(2))
         : null,
      // Bundle-specific fields
      totalIndividualPrice: product.totalIndividualPrice
         ? Number(product.totalIndividualPrice.toFixed(2))
         : null,
      type: product.type,
      status: product.status,
      templateId: product.templateId,

      // Map relational data to domain types
      features: map(product.features, (f) => ({
         icon: f.icon,
         title: f.title,
         description: f.description,
      })),
      useCases: map(product.useCases, (uc) => ({
         category: uc.category,
         description: uc.description,
         tags: uc.tags,
      })),
      examples: map(product.examples, (ex) => ({
         title: ex.title,
         content: ex.content,
      })),
      instructions: map(product.instructions, (inst) => ({
         step: inst.step,
         title: inst.title,
         description: inst.description,
      })),
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
   };

   if (product.template) {
      dProduct.template = toDPromptTemplate(product.template);
   }

   if (product.bundleItems && !isEmpty(product.bundleItems)) {
      const items = map(product.bundleItems, (item) => toDBundleItem(item));
      dProduct.bundleItems = items;
   }

   return dProduct;
};

const toDBundleItem = (item: BundleItemWithTemplate) => {
   const template = item.template ? toDPromptTemplate(item.template) : null;
   return {
      id: item.id,
      bundleId: item.bundleId,
      templateId: template ? template.id : null,
      template: template ?? null,
      createdAt: item.createdAt.toISOString(),
   };
};
