import { NextResponse } from "next/server";
import Stripe from "stripe";

import {
   handleStripeCheckoutCompleted,
   handleStripeCheckoutExpired,
   handleStripePaymentFailed,
} from "@/data/actions/order/order.actions";

export const handleStripeEvent = async (event: Stripe.Event) => {
   try {
      switch (event.type) {
         case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutCompleted(session);
            break;
         }

         case "checkout.session.expired": {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutExpired(session);
            break;
         }

         case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            await handlePaymentFailed(paymentIntent);
            break;
         }

         default:
            console.log(`Unhandled event type: ${event.type}`);
      }

      return NextResponse.json({ received: true }, { status: 200 });
   } catch (error) {
      console.error("Error processing webhook:", error);
      return NextResponse.json(
         { error: "Webhook processing failed" },
         { status: 500 }
      );
   }
};

export const handleCheckoutCompleted = async (
   session: Stripe.Checkout.Session
) => {
   const orderId = session.metadata?.orderId;

   if (!orderId) {
      console.error("No orderId in session metadata");
      return;
   }

   const result = await handleStripeCheckoutCompleted(
      orderId,
      session.payment_intent as string,
      session.payment_status
   );

   if (!result.success) {
      console.error(result.message);
      // Don't throw - order is paid, we need to handle this manually
   } else {
      console.log(result.message);
   }
};

export const handleCheckoutExpired = async (
   session: Stripe.Checkout.Session
) => {
   const orderId = session.metadata?.orderId;

   if (!orderId) {
      console.error("No orderId in session metadata");
      return;
   }

   const result = await handleStripeCheckoutExpired(orderId);

   if (!result.success) {
      console.error(result.message);
   } else {
      console.log(result.message);
   }
};

export const handlePaymentFailed = async (
   paymentIntent: Stripe.PaymentIntent
) => {
   const result = await handleStripePaymentFailed(paymentIntent.id);

   if (!result.success) {
      console.error(result.message);
   } else {
      console.log(result.message);
   }
};
