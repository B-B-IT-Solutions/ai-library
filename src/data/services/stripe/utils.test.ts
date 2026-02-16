import { dtestData } from "@tests";
import { map } from "es-toolkit/compat";
import Stripe from "stripe";

import { DCart } from "@/data/types/domain/cart";
import { DOrderCreate, DOrderItemCreate } from "@/data/types/domain/order";
import { SubscriptionStatus } from "@/generated/prisma/enums";

import {
   cartToOrderCreate,
   mapStripeStatus,
   subscriptionStatusMap,
   toStripePriceUnit,
} from "./utils";

const expectedSubscriptionStatusMap: Record<
   Stripe.Subscription.Status,
   SubscriptionStatus
> = {
   active: "ACTIVE",
   canceled: "CANCELED",
   incomplete: "INCOMPLETE",
   incomplete_expired: "INCOMPLETE",
   past_due: "PAST_DUE",
   unpaid: "UNPAID",
   trialing: "TRIALING",
   paused: "PAUSED",
};

describe("calculateSubTotalAmount tests", () => {
   it("calculateSubTotalAmount test", async () => {
      const item = dtestData.dCartItem();
      item.productPrice = 19.99;
      const price1 = toStripePriceUnit(item);
      expect(price1).toEqual(1999);

      item.productPrice = 299.9;
      const price2 = toStripePriceUnit(item);
      expect(price2).toEqual(29990);

      item.productPrice = 590;
      const price3 = toStripePriceUnit(item);
      expect(price3).toEqual(59000);
   });
});

describe("mapStripeStatus tests", () => {
   it("subscriptionStatusMap test", async () => {
      expect(expectedSubscriptionStatusMap).toEqual(subscriptionStatusMap);
   });

   it("mapStripeStatus test", async () => {
      expect(mapStripeStatus("active")).toEqual("ACTIVE");
      expect(mapStripeStatus("canceled")).toEqual("CANCELED");
      expect(mapStripeStatus("incomplete")).toEqual("INCOMPLETE");

      const none = "none" as Stripe.Subscription.Status;
      expect(mapStripeStatus(none)).toEqual("INCOMPLETE");
   });
});

describe("cartToOrderCreate tests", () => {
   const expectedOrderCreate = (cart: DCart) => {
      const orderItems: DOrderItemCreate[] = map(cart.items, (item) => ({
         productId: item.productId,
         productName: item.productName,
         productDescription: item.productDescription,
         productType: item.productType,
         quantity: item.quantity,
         price: Number(item.productPrice),
      }));

      const orderCreate: DOrderCreate = {
         totalAmount: cart.total,
         items: orderItems,
      };
      return orderCreate;
   };

   it("cartToOrderCreate test", async () => {
      const cart1 = dtestData.dCart(1, 3);
      const result1 = cartToOrderCreate(cart1);
      const expectedResult1 = expectedOrderCreate(cart1);
      expect(result1).toEqual(expectedResult1);

      const cart2 = dtestData.dCart(5, 10);
      const result2 = cartToOrderCreate(cart2);
      const expectedResult2 = expectedOrderCreate(cart2);
      expect(result2).toEqual(expectedResult2);

      const cart3 = dtestData.dCart(10, 30);
      const result3 = cartToOrderCreate(cart3);
      const expectedResult3 = expectedOrderCreate(cart3);
      expect(result3).toEqual(expectedResult3);
   });
});
