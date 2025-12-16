import { map } from "es-toolkit/compat";

import { toDPromptTemplate } from "@/data/actions/prompt/prompt.mapper";
import { DProduct } from "@/data/types/domain/product";

type PrismaProduct = {
   id: string;
   name: string;
   description: string;
   price: any;
   type: "TEMPLATE" | "BUNDLE" | "SUBSCRIPTION";
   status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
   templateId: string | null;
   subscriptionDuration: number | null;
   createdAt: Date;
   updatedAt: Date;
   template?: any;
   bundleItems?: any[];
};

export const toDProducts = (pProducts: PrismaProduct[]): DProduct[] => {
   return map(pProducts, (p) => toDProduct(p));
};

export const toDProduct = (product: PrismaProduct): DProduct => {
   const baseProduct: DProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price),
      type: product.type,
      status: product.status,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
   };

   // Add template if exists
   if (product.template) {
      baseProduct.template = toDPromptTemplate(product.template);
      baseProduct.templateId = product.templateId ?? undefined;
   }

   // Add subscription duration if exists
   if (product.subscriptionDuration) {
      baseProduct.subscriptionDuration = product.subscriptionDuration;
   }

   // Add bundle items if exists
   if (product.bundleItems && product.bundleItems.length > 0) {
      baseProduct.bundleItems = map(product.bundleItems, (item) =>
         toDPromptTemplate(item.template)
      );
   }

   return baseProduct;
};
