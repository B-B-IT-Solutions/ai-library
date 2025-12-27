import { isEmpty, map } from "es-toolkit/compat";

import { toDPromptTemplate } from "@/data/actions/prompt/prompt.mapper";
import {
   ProductItemWithTemplate,
   ProductWithDetails,
   ProductWithItems,
} from "@/data/types/db/product";
import { DProduct, DProductItem } from "@/data/types/domain/product";

export const toDProducts = (pProducts: ProductWithItems[]): DProduct[] => {
   return map(pProducts, (p) => toDProduct1(p));
};

export const toDProduct2 = (product: ProductWithDetails): DProduct => {
   const dProduct: DProduct = toDProduct1(product);

   dProduct.features = map(product.features, (f) => ({
      icon: f.icon,
      title: f.title,
      description: f.description,
   }));

   dProduct.useCases = map(product.useCases, (uc) => ({
      category: uc.category,
      description: uc.description,
      tags: uc.tags,
   }));

   dProduct.examples = map(product.examples, (ex) => ({
      title: ex.title,
      content: ex.content,
   }));

   dProduct.instructions = map(product.instructions, (inst) => ({
      step: inst.step,
      title: inst.title,
      description: inst.description,
   }));

   return dProduct;
};

export const toDProduct1 = (product: ProductWithItems): DProduct => {
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
      totalIndividualPrice: product.totalIndividualPrice
         ? Number(product.totalIndividualPrice.toFixed(2))
         : null,
      type: product.type,
      status: product.status,
      features: [],
      useCases: [],
      examples: [],
      instructions: [],
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
   };

   if (product.productItems && !isEmpty(product.productItems)) {
      const items = map(product.productItems, (item) => toDProductItem(item));
      dProduct.productItems = items;
   }

   return dProduct;
};

const toDProductItem = (item: ProductItemWithTemplate): DProductItem => {
   const template = item.template ? toDPromptTemplate(item.template) : null;
   return {
      id: item.id,
      productId: item.productId,
      templateId: template ? template.id : null,
      template: template ?? null,
      createdAt: item.createdAt.toISOString(),
   };
};
