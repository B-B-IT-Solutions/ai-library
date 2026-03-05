import { ptestData } from "@tests";
import { forEach } from "es-toolkit/compat";
import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";

import { ProductWithDetails, ProductWithItems } from "@/data/types/db/product";
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
   ProductItem,
   ProductUseCase,
} from "@/generated/prisma/client";

import {
   toDProductsWithItems,
   toDProductWithDetails,
   toDProductWithItems,
} from "./product.mapper";

const assertProduct = (dProduct: DProduct, product: Product) => {
   const discountAmount = product.discountAmount
      ? Number(product.discountAmount.toFixed(2))
      : null;

   expect(dProduct.id).toBe(product.id);
   expect(dProduct.name).toBe(product.name);
   expect(dProduct.description).toBe(product.description);
   expect(dProduct.price).toBe(Number(product.price.toFixed(2)));
   expect(dProduct.discountAmount).toEqual(discountAmount);
   expect(dProduct.type).toBe(product.type);
   expect(dProduct.status).toBe(product.status);
   expect(dProduct.createdAt).toBe(product.createdAt.toISOString());
   expect(dProduct.updatedAt).toBe(product.updatedAt.toISOString());
};

const assertProductWithItems = (
   dProduct: DProduct,
   product: ProductWithItems
) => {
   assertProduct(dProduct, product);
   expect(dProduct.features).toEqual([]);
   expect(dProduct.useCases).toEqual([]);
   expect(dProduct.examples).toEqual([]);
   expect(dProduct.instructions).toEqual([]);
   assertProductItems(dProduct.productItems, product.productItems);
};

const assertProductWithDetails = (
   dProduct: DProduct,
   product: ProductWithDetails
) => {
   assertProduct(dProduct, product);
   assertProductItems(dProduct.productItems, product.productItems);
   assertFeatures(dProduct.features, product.features);
   assertUseCases(dProduct.useCases, product.useCases);
   assertExamples(dProduct.examples, product.examples);
   assertInstructions(dProduct.instructions, product.instructions);
};

const assertProductItems = (dItems: DProductItem[], items: ProductItem[]) => {
   expect(dItems.length).toEqual(items.length);
   forEach(dItems, (dItem, index) => {
      assertProductItem(dItem, items[index]);
   });
};

const assertProductItem = (dItem: DProductItem, item: ProductItem) => {
   expect(dItem.id).toEqual(item.id);
   expect(dItem.productId).toEqual(item.productId);
   expect(dItem.templateId).toEqual(item.templateId);
   expect(dItem.createdAt).toEqual(item.createdAt.toISOString());

   expect(dItem.template).toBeDefined();
   expect(dItem.template!.id).toBe(item.templateId);
   expect(dItem.template!.title).toBeDefined();
};

const assertFeatures = (dFeatures: DFeature[], features: ProductFeature[]) => {
   expect(dFeatures.length).toEqual(features.length);
   forEach(dFeatures, (df, index) => {
      assertFeature(df, features[index]);
   });
};

const assertFeature = (df: DFeature, f: ProductFeature) => {
   const expectedIcon = Icons[f.icon as keyof typeof Icons] as LucideIcon;

   expect(df.title).toEqual(f.title);
   expect(df.description).toEqual(f.description);
   expect(df.icon).toEqual(expectedIcon);
};

const assertUseCases = (dUseCases: DUseCase[], useCases: ProductUseCase[]) => {
   expect(dUseCases.length).toEqual(useCases.length);
   forEach(dUseCases, (dUc, index) => {
      assertUseCase(dUc, useCases[index]);
   });
};

const assertUseCase = (dUc: DUseCase, uc: ProductUseCase) => {
   expect(dUc.category).toEqual(uc.category);
   expect(dUc.description).toEqual(uc.description);
   expect(dUc.tags).toEqual(uc.tags);
};

const assertExamples = (dExs: DExample[], exs: ProductExample[]) => {
   expect(dExs.length).toEqual(exs.length);
   forEach(dExs, (dEx, index) => {
      assertExample(dEx, exs[index]);
   });
};

const assertExample = (dEx: DExample, ex: ProductExample) => {
   expect(dEx.title).toEqual(ex.title);
   expect(dEx.content).toEqual(ex.content);
};

const assertInstructions = (
   dIns: DInstruction[],
   ins: ProductInstruction[]
) => {
   expect(dIns.length).toEqual(ins.length);
   forEach(dIns, (dEx, index) => {
      assertInstruction(dEx, ins[index]);
   });
};

const assertInstruction = (dIns: DInstruction, ins: ProductInstruction) => {
   expect(dIns.title).toEqual(ins.title);
   expect(dIns.description).toEqual(ins.description);
   expect(dIns.step).toEqual(ins.step);
};

describe("toDProductsWithItems tests", () => {
   it("toDProductsWithItems - empty array - test", () => {
      const results = toDProductsWithItems([]);
      expect(results).toEqual([]);
   });

   it("toDProductsWithItems - products mapped - test", () => {
      const products = ptestData.pProductsWithItems(3);
      const results = toDProductsWithItems(products);

      expect(results).toHaveLength(3);
      expect(results.length).toEqual(products.length);

      forEach(results, (dProduct, index) => {
         assertProductWithItems(dProduct, products[index]);
      });
   });
});

describe("toDProductWithItems tests", () => {
   it("toDProductWithItems - empty productItems - test", () => {
      const product = ptestData.pProductWithItems(1);
      product.productItems = [];
      product.discountAmount = null;

      const result = toDProductWithItems(product);

      expect(result.productItems).toEqual([]);
      assertProductWithItems(result, product);
   });

   it("toDProductWithItems - productItems defined - test", () => {
      const product = ptestData.pProductWithItems(3);

      const result = toDProductWithItems(product);

      expect(result.productItems).toHaveLength(3);
      assertProductWithItems(result, product);
   });
});

describe("toDProductWithDetails tests", () => {
   it("toDProductWithDetails - empty details - test", () => {
      const product = ptestData.pProductWithDetails(1);
      product.features = [];
      product.useCases = [];
      product.examples = [];
      product.instructions = [];
      product.discountAmount = null;

      const result = toDProductWithDetails(product);
      expect(result.features).toEqual([]);
      expect(result.useCases).toEqual([]);
      expect(result.examples).toEqual([]);
      expect(result.instructions).toEqual([]);
      assertProductWithDetails(result, product);
   });

   it("toDProductWithDetails - details defined - test", () => {
      const product = ptestData.pProductWithDetails(1);

      const result = toDProductWithDetails(product);
      expect(result.features).toHaveLength(3);
      expect(result.useCases).toHaveLength(3);
      expect(result.examples).toHaveLength(3);
      expect(result.instructions).toHaveLength(3);
      assertProductWithDetails(result, product);
   });
});
