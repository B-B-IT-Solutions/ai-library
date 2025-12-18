import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { completeOrder } from "@/data/actions/order/order.actions";
import { prisma } from "@/data/db/prisma";
import {
   pUpdateOrderStatus,
   pUpdateOrderWithStripeDetails,
} from "@/data/db/queries/order";
import { stripe } from "@/lib/stripe/stripe-server";

export async function POST(req: NextRequest) {
   const body = await req.text();
   const headersList = await headers();
   const signature = headersList.get("stripe-signature");

   if (!signature) {
      return NextResponse.json(
         { error: "No signature provided" },
         { status: 400 }
      );
   }

   let event: Stripe.Event;

   try {
      // Verify webhook signature
      event = stripe.webhooks.constructEvent(
         body,
         signature,
         process.env.STRIPE_WEBHOOK_SECRET!
      );
   } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
   }

   // Handle the event
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
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
   const orderId = session.metadata?.orderId;

   if (!orderId) {
      console.error("No orderId in session metadata");
      return;
   }

   // Check for duplicate processing (idempotency)
   const order = await prisma.order.findUnique({
      where: { id: orderId },
   });

   if (!order) {
      console.error(`Order ${orderId} not found`);
      return;
   }

   if (order.status === "COMPLETED") {
      console.log(`Order ${orderId} already completed`);
      return;
   }

   // Update with Stripe payment details
   await pUpdateOrderWithStripeDetails(orderId, {
      stripePaymentIntentId: session.payment_intent as string,
      stripePaymentStatus: session.payment_status,
      paymentMethod: "STRIPE",
   });

   // Complete the order (creates purchases, clears cart)
   const result = await completeOrder(orderId);

   if (!result.success) {
      console.error(`Failed to complete order ${orderId}:`, result.message);
      // Don't throw - order is paid, we need to handle this manually
   } else {
      console.log(`Order ${orderId} completed successfully`);
   }
}

async function handleCheckoutExpired(session: Stripe.Checkout.Session) {
   const orderId = session.metadata?.orderId;

   if (!orderId) {
      console.error("No orderId in session metadata");
      return;
   }

   await pUpdateOrderStatus(orderId, "FAILED");
   console.log(`Order ${orderId} marked as FAILED due to expired session`);
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
   // Find order by payment intent ID
   const order = await prisma.order.findFirst({
      where: { stripePaymentIntentId: paymentIntent.id },
   });

   if (!order) {
      console.error(`Order not found for payment intent ${paymentIntent.id}`);
      return;
   }

   await pUpdateOrderStatus(order.id, "FAILED");
   await pUpdateOrderWithStripeDetails(order.id, {
      stripePaymentStatus: "failed",
   });

   console.log(`Order ${order.id} marked as FAILED due to payment failure`);
}
