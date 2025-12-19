"use server";

import { isEmpty } from "es-toolkit/compat";

import { requireUser } from "@/data/actions/auth-utils";
import { getCart } from "@/data/actions/cart";
import { formatError } from "@/data/actions/utils";
import {
   pCreateOrder,
   pUpdateOrderWithStripeDetails,
} from "@/data/db/queries/order";
import { ActionResult } from "@/data/types/utils";
import { APP_URL } from "@/lib/constants";
import { stripe } from "@/lib/stripe/stripe-server";

type CheckoutResponse = {
   sessionId: string;
   url: string;
};

export const createCheckoutSession = async (): Promise<
   ActionResult<CheckoutResponse>
> => {
   try {
      const user = await requireUser();
      const cart = await getCart();

      if (isEmpty(cart.items)) {
         return {
            success: false,
            message: "Your cart is empty.",
         };
      }

      const totalAmount = cart.items.reduce((sum, item) => {
         const price = Number(item.productPrice);
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
            unit_amount: Math.round(Number(item.productPrice) * 100), // Convert to cents
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
