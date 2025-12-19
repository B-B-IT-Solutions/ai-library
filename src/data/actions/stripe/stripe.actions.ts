"use server";

import { isEmpty } from "es-toolkit/compat";

import { pGetCartByUserId } from "@/data/db/queries/cart";
import {
   pCreateOrder,
   pUpdateOrderWithStripeDetails,
} from "@/data/db/queries/order";
import { ActionResult } from "@/data/types/utils";
import { APP_URL } from "@/lib/constants";
import { stripe } from "@/lib/stripe/stripe-server";
import { requireUser } from "../auth-utils";
import { formatError } from "../utils";

type CheckoutResponse = {
   sessionId: string;
   url: string;
};

export const createCheckoutSession = async (): Promise<
   ActionResult<CheckoutResponse>
> => {
   try {
      const user = await requireUser();
      const cart = await pGetCartByUserId(user.id);

      if (!cart || isEmpty(cart.items)) {
         return {
            success: false,
            message: "Your cart is empty.",
         };
      }

      const totalAmount = cart.items.reduce((sum, item) => {
         const price = Number(item.product.price);
         return sum + price * item.quantity;
      }, 0);

      // Create pending order FIRST
      const order = await pCreateOrder({
         user: {
            connect: {
               id: user.id,
            },
         },
         status: "PENDING",
         totalAmount,
         items: {
            create: cart.items.map((item) => ({
               product: {
                  connect: {
                     id: item.productId,
                  },
               },
               quantity: item.quantity,
               price: Number(item.product.price),
            })),
         },
      });

      // Create Stripe line items
      const lineItems = cart.items.map((item) => ({
         price_data: {
            currency: "chf",
            product_data: {
               name: item.product.name,
               description: item.product.description || undefined,
            },
            unit_amount: Math.round(Number(item.product.price) * 100), // Convert to cents
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

      await pUpdateOrderWithStripeDetails(order.id, {
         stripeCheckoutSessionId: checkoutSession.id,
         stripePaymentStatus: "unpaid",
      });

      return {
         success: true,
         message: "Checkout session created",
         data: {
            sessionId: checkoutSession.id,
            url: checkoutSession.url!,
         },
      };
   } catch (error) {
      return {
         success: false,
         message: formatError(error),
      };
   }
};
