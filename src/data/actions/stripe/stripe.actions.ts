"use server";

import { auth } from "@/auth";
import { pGetCartByUserId } from "@/data/db/queries/cart";
import {
   pCreateOrder,
   pUpdateOrderWithStripeDetails,
} from "@/data/db/queries/order";
import { ActionResult } from "@/data/types/utils";
import { stripe } from "@/lib/stripe/stripe-server";
import { formatError } from "../utils";

export const createCheckoutSession = async (): Promise<
   ActionResult<{ sessionId: string; url: string }>
> => {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return {
            success: false,
            message: "You must be logged in to checkout.",
         };
      }

      const userId = session.user.id;
      const cart = await pGetCartByUserId(userId);

      if (!cart || cart.items.length === 0) {
         return {
            success: false,
            message: "Your cart is empty.",
         };
      }

      // Calculate total
      const totalAmount = cart.items.reduce((sum, item) => {
         const price = Number(item.product.price);
         return sum + price * item.quantity;
      }, 0);

      // Create pending order FIRST
      const order = await pCreateOrder({
         user: { connect: { id: userId } },
         status: "PENDING",
         totalAmount,
         items: {
            create: cart.items.map((item) => ({
               product: { connect: { id: item.productId } },
               quantity: item.quantity,
               price: Number(item.product.price),
            })),
         },
      });

      // Create Stripe line items
      const lineItems = cart.items.map((item) => ({
         price_data: {
            currency: "usd",
            product_data: {
               name: item.product.name,
               description: item.product.description || undefined,
            },
            unit_amount: Math.round(Number(item.product.price) * 100), // Convert to cents
         },
         quantity: item.quantity,
      }));

      // Create Stripe Checkout Session
      const checkoutSession = await stripe.checkout.sessions.create({
         mode: "payment",
         payment_method_types: ["card"],
         line_items: lineItems,
         customer_email: session.user.email || undefined,
         client_reference_id: order.id,
         metadata: {
            orderId: order.id,
            userId: userId,
         },
         success_url: `${process.env.NEXT_PUBLIC_APP_URL}/orders/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
      });

      // Update order with Stripe session ID
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
