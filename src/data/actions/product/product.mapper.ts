import { map } from "es-toolkit/compat";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

import { toDPrompt } from "@/data/repositories/template";
import {
   ProductItemWithTemplate,
   ProductWithDetails,
   ProductWithItems,
} from "@/data/types/db/product";
import {
   DExample,
   DFeature,
   DInstruction,
   DProduct,
   DProductItem,
   DUseCase,
} from "@/data/types/domain/product";
import {
   Product,
   ProductExample,
   ProductFeature,
   ProductInstruction,
   ProductUseCase,
} from "@/generated/prisma/client";

export const toDProductsWithItems = (
   pProducts: ProductWithItems[]
): DProduct[] => {
   return map(pProducts, (p) => toDProductWithItems(p));
};

export const toDProductWithDetails = (
   product: ProductWithDetails
): DProduct => {
   const dProduct: DProduct = toDProductWithItems(product);
   dProduct.features = toDFeatures(product.features);
   dProduct.useCases = toDUseCases(product.useCases);
   dProduct.examples = toDExamples(product.examples);
   dProduct.instructions = toDInstructions(product.instructions);
   return dProduct;
};

export const toDProductWithItems = (product: ProductWithItems): DProduct => {
   const dProduct: DProduct = toDProduct(product);
   dProduct.productItems = toDProductItems(product.productItems);
   return dProduct;
};

const toDProduct = (product: Product): DProduct => {
   const discountAmount = product.discountAmount
      ? Number(product.discountAmount.toFixed(2))
      : null;

   const dProduct: DProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price.toFixed(2)),
      discountAmount: discountAmount,
      type: product.type,
      status: product.status,
      features: [],
      useCases: [],
      examples: [],
      instructions: [],
      productItems: [],
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
   };

   return dProduct;
};

const toDProductItems = (items: ProductItemWithTemplate[]): DProductItem[] => {
   return map(items, (item) => toDProductItem(item));
};

const toDProductItem = (item: ProductItemWithTemplate): DProductItem => {
   return {
      id: item.id,
      productId: item.productId,
      templateId: item.templateId,
      template: toDPrompt(item.template),
      createdAt: item.createdAt.toISOString(),
   };
};

const toDFeatures = (features: ProductFeature[]): DFeature[] => {
   return map(features, (f) => toDFeature(f));
};

const toDFeature = (f: ProductFeature): DFeature => {
   return {
      icon: Icons[f.icon as keyof typeof Icons] as LucideIcon,
      title: f.title,
      description: f.description,
   };
};

const toDUseCases = (useCases: ProductUseCase[]): DUseCase[] => {
   return map(useCases, (uc) => toDUseCase(uc));
};

const toDUseCase = (uc: ProductUseCase): DUseCase => {
   return {
      category: uc.category,
      description: uc.description,
      tags: uc.tags,
   };
};

const toDExamples = (examples: ProductExample[]): DExample[] => {
   return map(examples, (ex) => toDExample(ex));
};

const toDExample = (ex: ProductExample): DExample => {
   return {
      title: ex.title,
      content: ex.content,
   };
};

const toDInstructions = (
   instructions: ProductInstruction[]
): DInstruction[] => {
   return map(instructions, (inst) => toDInstruction(inst));
};

const toDInstruction = (inst: ProductInstruction): DInstruction => {
   return {
      step: inst.step,
      title: inst.title,
      description: inst.description,
   };
};
