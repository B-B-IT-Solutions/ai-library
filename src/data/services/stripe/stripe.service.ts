"use server";

import { isEmpty } from "es-toolkit/compat";

import { requireUser } from "@/data/actions/auth-utils";
import { getCart } from "@/data/actions/cart";
import prisma from "@/data/db/prisma";
import { OrderRepository } from "@/data/db/queries/order";
import { CartService } from "@/data/services/cart";
import { OrderService } from "@/data/services/order";
import { APP_URL } from "@/lib/constants";
import { stripe } from "@/lib/stripe/stripe-server";

import { toStripePriceUnit } from "./utils";

type CheckoutResponse = {
   sessionId: string;
   url: string;
};

export class StripeService {
   private cartService: CartService;
   private orderService: OrderService;

   constructor(cartService: CartService, orderService: OrderService) {
      this.cartService = cartService;
      this.orderService = orderService;
   }

   async createCheckoutSession(): Promise<CheckoutResponse> {
      const user = await requireUser();
      const cart = await getCart();

      if (isEmpty(cart.items)) {
         throw new Error("Your cart is empty.");
      }

      // Create pending order FIRST
      const orderRepository = new OrderRepository(prisma);
      const order = await orderRepository.pCreateOrder({
         user: {
            connect: {
               id: user.id,
            },
         },
         status: "PENDING",
         totalAmount: cart.total,
         items: {
            create: cart.items.map((item) => ({
               product: {
                  connect: {
                     id: item.productId,
                  },
               },
               productName: item.productName,
               productDescription: item.productDescription,
               productType: item.productType,
               quantity: item.quantity,
               price: Number(item.productPrice),
            })),
         },
      });

      // Create Stripe line items
      const lineItems = cart.items.map((item) => ({
         price_data: {
            currency: "chf",
            product_data: {
               name: item.productName,
               description: item.productDescription,
            },
            unit_amount: toStripePriceUnit(item),
         },
         quantity: item.quantity,
      }));

      const checkoutSession = await stripe.checkout.sessions.create({
         mode: "payment",
         payment_method_types: ["card"],
         line_items: lineItems,
         customer_email: user.email || undefined,
         client_reference_id: order.id,
         metadata: {
            orderId: order.id,
            userId: user.id,
         },
         success_url: `${APP_URL}/orders/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${APP_URL}/checkout?canceled=true`,
      });

      await orderRepository.pUpdateOrder(order.id, {
         stripeCheckoutSessionId: checkoutSession.id,
         stripePaymentStatus: "unpaid",
      });

      return {
         sessionId: checkoutSession.id,
         url: checkoutSession.url!,
      };
   }
}
