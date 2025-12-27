import { ptestData } from "@tests";

import { ProductWithItems } from "@/data/types/db/product";
import { DProduct } from "@/data/types/domain/product";
import { Product } from "@/generated/prisma/client";

import { toDProduct1, toDProducts } from "./product.mapper";

const assertBaseProduct = (dProduct: DProduct, product: Product) => {
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
   assertBaseProduct(dProduct, product);
   expect(dProduct.features).toEqual([]);
   expect(dProduct.useCases).toEqual([]);
   expect(dProduct.examples).toEqual([]);
   expect(dProduct.instructions).toEqual([]);
};

describe("toDProducts tests", () => {
   it("toDProducts - empty array - test", () => {
      const products = ptestData.pProductsWithItems(0);
      const result = toDProducts(products);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
   });

   it("toDProducts - products mapped - test", () => {
      const products = ptestData.pProductsWithItems(3);
      const result = toDProducts(products);

      expect(result).toHaveLength(3);
      result.forEach((dProduct, index) => {
         assertProductWithItems(dProduct, products[index]);
      });
   });
});

describe("toDProduct1 tests", () => {
   const assertCommon = (result: DProduct, product: Product) => {
      expect(result.id).toBe(product.id);
      expect(result.name).toBe(product.name);
      expect(result.description).toBe(product.description);
      expect(result.price).toBe(Number(product.price));
      expect(result.type).toBe(product.type);
      expect(result.status).toBe(product.status);
      expect(result.features).toEqual([]);
      expect(result.useCases).toEqual([]);
      expect(result.examples).toEqual([]);
      expect(result.instructions).toEqual([]);
      expect(result.createdAt).toBe(product.createdAt.toISOString());
      expect(result.updatedAt).toBe(product.updatedAt.toISOString());
   };

   it("toDProduct1 - with empty productItems - test", () => {
      const product = ptestData.pProductWithItems(1);
      product.productItems = [];

      const result = toDProduct1(product);

      assertCommon(result, product);
      expect(result.productItems).toBeUndefined();
   });

   it("toDProduct1 - with productItems - test", () => {
      const product = ptestData.pProductWithItems(3);
      const productItems = product.productItems;

      const result = toDProduct1(product);

      assertCommon(result, product);
      expect(result.productItems).toHaveLength(3);

      result.productItems?.forEach((item, index) => {
         expect(item.id).toBe(productItems[index].id);
         expect(item.productId).toBe(productItems[index].productId);
         expect(item.templateId).toBe(productItems[index].template?.id);
         expect(item.createdAt).toBe(
            productItems[index].createdAt.toISOString()
         );

         expect(item.template).toBeDefined();
         expect(item.template?.id).toBe(productItems[index].template?.id);
         expect(item.template?.title).toBe(productItems[index].template?.title);
         expect(item.template?.content).toBe(
            productItems[index].template?.content
         );
      });
   });

   it("toDProduct1 - productItem without template - test", () => {
      const product = ptestData.pProductWithItems(1);
      const productItem = product.productItems[0];
      productItem.template = null;

      const result = toDProduct1(product);

      assertCommon(result, product);
      expect(result.productItems).toHaveLength(3);
      expect(result.productItems?.[0].template).toBeNull();
      expect(result.productItems?.[0].templateId).toBeNull();
   });

   it("toDProduct1 - price conversion from Decimal - test", () => {
      const product = ptestData.pProductWithItems(1);

      const result = toDProduct1(product);

      assertCommon(result, product);
      expect(typeof result.price).toBe("number");
      expect(result.price).toBe(Number(product.price));
   });

   it("toDProduct1 - date conversion to ISO string - test", () => {
      const product = ptestData.pProductWithItems(1);

      const result = toDProduct1(product);

      assertCommon(result, product);
      expect(typeof result.createdAt).toBe("string");
      expect(typeof result.updatedAt).toBe("string");
      expect(result.createdAt).toBe(product.createdAt.toISOString());
      expect(result.updatedAt).toBe(product.updatedAt.toISOString());
   });
});
