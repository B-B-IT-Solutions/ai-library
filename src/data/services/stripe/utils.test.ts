import { dtestData } from "@tests";
import Stripe from "stripe";

import { SubscriptionStatus } from "@/generated/prisma/enums";

import {
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
