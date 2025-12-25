import { ptestData } from "@tests";

import { toDProduct, toDProducts } from "./product.mapper";

describe("toDProducts tests", () => {
   it("toDProducts - empty array - test", () => {
      const products = ptestData.pProductsWithTemplateBundleItems(0);

      const result = toDProducts(products);

      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
   });

   it("toDProducts - converts multiple products - test", () => {
      const products = ptestData.pProductsWithTemplateBundleItems(3);

      const result = toDProducts(products);

      expect(result).toHaveLength(3);
      result.forEach((product, index) => {
         expect(product.id).toBe(products[index].id);
         expect(product.name).toBe(products[index].name);
         expect(product.description).toBe(products[index].description);
         expect(product.price).toBe(Number(products[index].price.toFixed(2)));
         expect(product.type).toBe(products[index].type);
         expect(product.status).toBe(products[index].status);
         expect(product.templateId).toBe(products[index].templateId);
         expect(product.createdAt).toBe(
            products[index].createdAt.toISOString()
         );
         expect(product.updatedAt).toBe(
            products[index].updatedAt.toISOString()
         );
      });
   });
});

describe("toDProduct tests", () => {
   it("toDProduct - with template and bundleItems - test", () => {
      const product = ptestData.pProductWithTemplateBundleItems(1);

      const result = toDProduct(product);

      expect(result.id).toBe(product.id);
      expect(result.name).toBe(product.name);
      expect(result.description).toBe(product.description);
      expect(result.price).toBe(Number(product.price));
      expect(result.type).toBe(product.type);
      expect(result.status).toBe(product.status);
      expect(result.templateId).toBe(product.templateId);
      expect(result.createdAt).toBe(product.createdAt.toISOString());
      expect(result.updatedAt).toBe(product.updatedAt.toISOString());

      // Verify template is mapped
      expect(result.template).toBeDefined();
      expect(result.template?.id).toBe(product.template?.id);
      expect(result.template?.title).toBe(product.template?.title);
      expect(result.template?.content).toBe(product.template?.content);
      expect(result.template?.recommendedModel).toBe(
         product.template?.recommendedModel
      );

      // Verify bundleItems are mapped
      expect(result.bundleItems).toBeDefined();
      expect(result.bundleItems).toHaveLength(product.bundleItems?.length ?? 0);
   });

   it("toDProduct - without template - test", () => {
      const product = ptestData.pProductWithTemplateBundleItems(1);
      product.template = null;

      const result = toDProduct(product);

      expect(result.id).toBe(product.id);
      expect(result.name).toBe(product.name);
      expect(result.template).toBeUndefined();
   });

   it("toDProduct - with empty bundleItems array - test", () => {
      const product = ptestData.pProductWithTemplateBundleItems(1);
      product.bundleItems = [];

      const result = toDProduct(product);

      expect(result.id).toBe(product.id);
      expect(result.name).toBe(product.name);
      expect(result.bundleItems).toBeUndefined();
   });

   it("toDProduct - bundleItems mapping - test", () => {
      const product = ptestData.pProductWithTemplateBundleItems(1);
      const bundleItems = ptestData.pBundleItems(2);
      product.bundleItems = bundleItems;

      const result = toDProduct(product);

      expect(result.bundleItems).toBeDefined();
      expect(result.bundleItems).toHaveLength(2);

      result.bundleItems?.forEach((item, index) => {
         expect(item.id).toBe(bundleItems[index].id);
         expect(item.bundleId).toBe(bundleItems[index].bundleId);
         expect(item.templateId).toBe(bundleItems[index].template?.id);
         expect(item.createdAt).toBe(
            bundleItems[index].createdAt.toISOString()
         );

         // Verify template in bundle item
         expect(item.template).toBeDefined();
         expect(item.template?.id).toBe(bundleItems[index].template?.id);
         expect(item.template?.title).toBe(bundleItems[index].template?.title);
         expect(item.template?.content).toBe(
            bundleItems[index].template?.content
         );
      });
   });

   it("toDProduct - bundleItem without template - test", () => {
      const product = ptestData.pProductWithTemplateBundleItems(1);
      const bundleItem = ptestData.pBundleItem(1);
      bundleItem.template = null;
      product.bundleItems = [bundleItem];

      const result = toDProduct(product);

      expect(result.bundleItems).toBeDefined();
      expect(result.bundleItems).toHaveLength(1);
      expect(result.bundleItems?.[0].template).toBeNull();
      expect(result.bundleItems?.[0].templateId).toBeNull();
   });

   it("toDProduct - price conversion from Decimal - test", () => {
      const product = ptestData.pProductWithTemplateBundleItems(1);

      const result = toDProduct(product);

      expect(typeof result.price).toBe("number");
      expect(result.price).toBe(Number(product.price));
   });

   it("toDProduct - date conversion to ISO string - test", () => {
      const product = ptestData.pProductWithTemplateBundleItems(1);

      const result = toDProduct(product);

      expect(typeof result.createdAt).toBe("string");
      expect(typeof result.updatedAt).toBe("string");
      expect(result.createdAt).toBe(product.createdAt.toISOString());
      expect(result.updatedAt).toBe(product.updatedAt.toISOString());
   });
});
