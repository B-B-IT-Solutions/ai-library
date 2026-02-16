import { map } from "es-toolkit/compat";
import Stripe from "stripe";

import { DCart, DCartItem } from "@/data/types/domain/cart";
import { DOrderCreate, DOrderItemCreate } from "@/data/types/domain/order";
import { SubscriptionStatus } from "@/generated/prisma/enums";

export const subscriptionStatusMap: Record<
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

export const toStripePriceUnit = (item: DCartItem) => {
   return Math.round(item.productPrice * 100); // Convert to cents
};

export const mapStripeStatus = (
   stripeStatus: Stripe.Subscription.Status
): SubscriptionStatus => {
   return subscriptionStatusMap[stripeStatus] || "INCOMPLETE";
};

export const cartToOrderCreate = (cart: DCart): DOrderCreate => {
   const orderItems: DOrderItemCreate[] = map(cart.items, (item) => ({
      productId: item.productId,
      productName: item.productName,
      productDescription: item.productDescription,
      productType: item.productType,
      quantity: item.quantity,
      price: Number(item.productPrice),
   }));

   const oCreate: DOrderCreate = {
      totalAmount: cart.total,
      items: orderItems,
   };
   return oCreate;
};
