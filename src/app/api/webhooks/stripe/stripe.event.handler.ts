import { NextResponse } from "next/server";
import Stripe from "stripe";

import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";

export const handleStripeEvent = async (event: Stripe.Event) => {
   try {
      switch (event.type) {
         case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;

            if (session.mode === "subscription") {
               await handleSubscriptionCheckoutCompleted(session);
            } else if (session.mode === "payment") {
               await handlePaymentCheckoutCompleted(session);
            }
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

         case "customer.subscription.created":
         case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionUpdated(subscription);
            break;
         }

         case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionDeleted(subscription);
            break;
         }

         case "invoice.payment_succeeded": {
            const invoice = event.data.object as Stripe.Invoice;
            await handleInvoicePaymentSucceeded(invoice);
            break;
         }

         case "invoice.payment_failed": {
            const invoice = event.data.object as Stripe.Invoice;
            await handleInvoicePaymentFailed(invoice);
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

const handlePaymentCheckoutCompleted = async (
   session: Stripe.Checkout.Session
) => {
   const orderId = session.metadata?.orderId;
   if (!orderId) {
      throw new Error("No orderId in session metadata");
   }

   try {
      await prisma.$transaction(async (tx) => {
         const service = getOrderSevice(tx);
         return service.handlePaymentCheckoutCompleted(
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

const handleSubscriptionCheckoutCompleted = async (
   session: Stripe.Checkout.Session
) => {
   try {
      await prisma.$transaction(async (tx) => {
         const service = getStripeService(tx);
         return service.handleSubscriptionCheckoutCompleted(session);
      });
   } catch (error) {
      console.error("Error handling subscription checkout:", error);
   }
};

const handleSubscriptionUpdated = async (subscription: Stripe.Subscription) => {
   try {
      await prisma.$transaction(async (tx) => {
         const service = getStripeService(tx);
         return service.handleSubscriptionUpdated(subscription);
      });
   } catch (error) {
      console.error("Error handling subscription update:", error);
   }
};

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
   try {
      await prisma.$transaction(async (tx) => {
         const service = getStripeService(tx);
         return service.handleSubscriptionDeleted(subscription);
      });
   } catch (error) {
      console.error("Error handling subscription deletion:", error);
   }
};

const handleInvoicePaymentSucceeded = async (invoice: Stripe.Invoice) => {
   try {
      await prisma.$transaction(async (tx) => {
         const service = getStripeService(tx);
         return service.handleInvoicePaymentSucceeded(invoice);
      });
   } catch (error) {
      console.error("Error handling invoice payment succeeded:", error);
   }
};

const handleInvoicePaymentFailed = async (invoice: Stripe.Invoice) => {
   try {
      await prisma.$transaction(async (tx) => {
         const service = getSubscriptionService(tx);
         return service.handleInvoicePaymentFailed(invoice);
      });
   } catch (error) {
      console.error("Error handling invoice payment failed:", error);
   }
};

const getOrderSevice = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getOrderService();
};

const getSubscriptionService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getSubscriptionService();
};

const getStripeService = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getStripeService();
};
