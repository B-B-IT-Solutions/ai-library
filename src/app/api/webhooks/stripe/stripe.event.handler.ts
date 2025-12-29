import { NextResponse } from "next/server";
import Stripe from "stripe";

import prisma from "@/data/db/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";

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

const handleCheckoutCompleted = async (session: Stripe.Checkout.Session) => {
   const orderId = session.metadata?.orderId;
   if (!orderId) {
      throw new Error("No orderId in session metadata");
   }

   try {
      await prisma.$transaction(async (tx) => {
         const service = getOrderSevice(tx);
         return service.handleStripeCheckoutCompleted(
            orderId,
            session.payment_intent as string,
            session.payment_status
         );
      });
   } catch (error) {
      console.error(error);
   }
};

const handleCheckoutExpired = async (session: Stripe.Checkout.Session) => {
   const orderId = session.metadata?.orderId;
   if (!orderId) {
      throw new Error("No orderId in session metadata");
   }

   try {
      await prisma.$transaction(async (tx) => {
         const service = getOrderSevice(tx);
         return service.handleStripeCheckoutExpired(orderId);
      });
   } catch (error) {
      console.error(error);
   }
};

const handlePaymentFailed = async (paymentIntent: Stripe.PaymentIntent) => {
   try {
      await prisma.$transaction(async (tx) => {
         const service = getOrderSevice(tx);
         return service.handleStripePaymentFailed(paymentIntent.id);
      });
   } catch (error) {
      console.error(error);
   }
};

const getOrderSevice = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getOrderService();
};
