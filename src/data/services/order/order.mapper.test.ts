import { ptestData } from "@tests";
import { forEach } from "es-toolkit/compat";

import { OrderWithItems } from "@/data/types/db/order";
import { DOrder, DOrderItem } from "@/data/types/domain/order";
import { Order, OrderItem } from "@/generated/prisma/client";

import { toDOrdersWithItems, toDOrderWithItems } from "./order.mapper";

const assertOrder = (dOrder: DOrder, order: Order) => {
   expect(dOrder.id).toBe(order.id);
   expect(dOrder.status).toBe(order.status);
   expect(dOrder.totalAmount).toBe(Number(order.totalAmount.toFixed(2)));
   expect(dOrder.paymentMethod).toBe(order.paymentMethod);
   expect(dOrder.stripeCheckoutSessionId).toBe(order.stripeCheckoutSessionId);
   expect(dOrder.stripePaymentIntentId).toBe(order.stripePaymentIntentId);
   expect(dOrder.stripePaymentStatus).toBe(order.stripePaymentStatus);
   expect(dOrder.status).toBe(order.status);
   expect(dOrder.createdAt).toBe(order.createdAt.toISOString());
   expect(dOrder.updatedAt).toBe(order.updatedAt.toISOString());
};

const assertOrderWithItems = (dProduct: DOrder, product: OrderWithItems) => {
   assertOrder(dProduct, product);
   assertOrderItems(dProduct.items, product.items);
};

const assertOrderItems = (dItems: DOrderItem[], items: OrderItem[]) => {
   expect(dItems.length).toEqual(items.length);
   forEach(dItems, (dItem, index) => {
      assertProductItem(dItem, items[index]);
   });
};

const assertProductItem = (dItem: DOrderItem, item: OrderItem) => {
   expect(dItem.id).toEqual(item.id);
   expect(dItem.orderId).toEqual(item.orderId);
   expect(dItem.productId).toEqual(item.productId);
   expect(dItem.productName).toEqual(item.productName);
   expect(dItem.productDescription).toEqual(item.productDescription);
   expect(dItem.productType).toEqual(item.productType);
   expect(dItem.price).toBe(Number(item.price.toFixed(2)));
   expect(dItem.createdAt).toEqual(item.createdAt.toISOString());
};

describe("toDOrdersWithItems tests", () => {
   it("toDOrdersWithItems - empty array - test", () => {
      const results = toDOrdersWithItems([]);
      expect(results).toEqual([]);
   });

   it("toDOrdersWithItems - products mapped - test", () => {
      const orders = ptestData.pOrdersWithItems(3);
      const results = toDOrdersWithItems(orders);

      expect(results).toHaveLength(3);
      expect(results.length).toEqual(orders.length);

      forEach(results, (dProduct, index) => {
         assertOrderWithItems(dProduct, orders[index]);
      });
   });
});

describe("toDOrderWithItems tests", () => {
   it("toDOrderWithItems - empty productItems - test", () => {
      const order = ptestData.pOrderWithItems(1);
      order.items = [];

      const result = toDOrderWithItems(order);

      expect(result.items).toEqual([]);
      assertOrderWithItems(result, order);
   });

   it("toDOrderWithItems - productItems defined - test", () => {
      const order = ptestData.pOrderWithItems(3);

      const result = toDOrderWithItems(order);

      expect(result.items).toHaveLength(3);
      assertOrderWithItems(result, order);
   });
});
