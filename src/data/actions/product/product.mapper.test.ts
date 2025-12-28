import { ptestData } from "@tests";

import { ProductWithItems } from "@/data/types/db/product";
import { DProduct, DProductItem } from "@/data/types/domain/product";
import { Product, ProductItem } from "@/generated/prisma/client";

import { toDProductsWithItems, toDProductWithItems } from "./product.mapper";

const assertProduct = (dProduct: DProduct, product: Product) => {
   expect(dProduct.id).toBe(product.id);
   expect(dProduct.name).toBe(product.name);
   expect(dProduct.description).toBe(product.description);
   expect(dProduct.price).toBe(Number(product.price.toFixed(2)));
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

const assertProductItems = (dItems: DProductItem[], items: ProductItem[]) => {
   expect(dItems.length).toEqual(items.length);
   dItems.forEach((dItem, index) => {
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
   expect(dItem.template!.content).toBeDefined();
};

describe("toDProductsWithItems tests", () => {
   it("toDProductsWithItems - empty array - test", () => {
      const products = ptestData.pProductsWithItems(0);
      const result = toDProductsWithItems(products);

      expect(result).toEqual([]);
   });

   it("toDProductsWithItems - products mapped - test", () => {
      const products = ptestData.pProductsWithItems(3);
      const result = toDProductsWithItems(products);

      expect(result).toHaveLength(3);
      expect(result.length).toEqual(products.length);

      result.forEach((dProduct, index) => {
         assertProductWithItems(dProduct, products[index]);
      });
   });
});

describe("toDProductWithItems tests", () => {
   it("toDProduct1 - with empty productItems - test", () => {
      const product = ptestData.pProductWithItems(1);
      product.productItems = [];

      const result = toDProductWithItems(product);

      expect(result.productItems).toEqual([]);
      assertProductWithItems(result, product);
   });

   it("toDProduct1 - with productItems - test", () => {
      const product = ptestData.pProductWithItems(3);

      const result = toDProductWithItems(product);

      expect(result.productItems).toHaveLength(3);
      assertProductWithItems(result, product);
   });
});
