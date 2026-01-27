jest.mock("@/data/services/order");
jest.mock("@/data/services/stripe");
jest.mock("next/server");

import { stripeTestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { OrderService } from "@/data/services/order";
import { StripeService } from "@/data/services/stripe";

import { handleStripeEvent } from "./stripe.event.handler";

const sPaymentCheckoutCompleted =
   OrderService.prototype.handlePaymentCheckoutCompleted;
const sStripeCheckoutExpired =
   OrderService.prototype.handleStripeCheckoutExpired;
const sStripePaymentFailed = OrderService.prototype.handleStripePaymentFailed;

const sPaymentCheckoutCompletedMock =
   sPaymentCheckoutCompleted as jest.MockedFunction<
      typeof sPaymentCheckoutCompleted
   >;
const sStripeCheckoutExpiredMock =
   sStripeCheckoutExpired as jest.MockedFunction<typeof sStripeCheckoutExpired>;
const sStripePaymentFailedMock = sStripePaymentFailed as jest.MockedFunction<
   typeof sStripePaymentFailed
>;

const sHandleSubscriptionCheckoutCompleted =
   StripeService.prototype.handleSubscriptionCheckoutCompleted;
const sHandleSubscriptionUpdated =
   StripeService.prototype.handleSubscriptionUpdated;
const sHandleSubscriptionDeleted =
   StripeService.prototype.handleSubscriptionDeleted;
const sHandleInvoicePaymentSucceeded =
   StripeService.prototype.handleInvoicePaymentSucceeded;
const sHandleInvoicePaymentFailed =
   StripeService.prototype.handleInvoicePaymentFailed;

const sHandleSubscriptionCheckoutCompletedMock =
   sHandleSubscriptionCheckoutCompleted as jest.MockedFunction<
      typeof sHandleSubscriptionCheckoutCompleted
   >;
const sHandleSubscriptionUpdatedMock =
   sHandleSubscriptionUpdated as jest.MockedFunction<
      typeof sHandleSubscriptionUpdated
   >;
const sHandleSubscriptionDeletedMock =
   sHandleSubscriptionDeleted as jest.MockedFunction<
      typeof sHandleSubscriptionDeleted
   >;
const sHandleInvoicePaymentSucceededMock =
   sHandleInvoicePaymentSucceeded as jest.MockedFunction<
      typeof sHandleInvoicePaymentSucceeded
   >;
const sHandleInvoicePaymentFailedMock =
   sHandleInvoicePaymentFailed as jest.MockedFunction<
      typeof sHandleInvoicePaymentFailed
   >;

const nextResponseMock = NextResponse as unknown as DeepMockProxy<NextResponse>;

describe("handleStripeEvent tests", () => {
   const originalConsoleLog = console.log;
   const originalConsoleError = console.error;

   beforeEach(() => {
      jest.clearAllMocks();
      console.log = jest.fn();
      console.error = jest.fn();
   });

   afterEach(() => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
   });

   describe("checkout.session.completed tests", () => {
      it("stripe - checkout.session.completed - orderId null - test", async () => {
         const event = stripeTestData.checkoutSessionCompletedEvent();
         const session = event.data.object as Stripe.Checkout.Session;
         session.metadata = { orderId: undefined };

         await handleStripeEvent(event);

         const expectedPayload = { error: "Webhook processing failed" };
         const expectedStatus = { status: 500 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sPaymentCheckoutCompletedMock).not.toHaveBeenCalled();
         expect(console.error).toHaveBeenCalledTimes(1);
      });

      it("stripe - checkout.session.completed - processing error - test", async () => {
         const event = stripeTestData.checkoutSessionCompletedEvent();
         sPaymentCheckoutCompletedMock.mockRejectedValue(
            new Error("processing error")
         );

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sPaymentCheckoutCompletedMock).toHaveBeenCalledTimes(1);
         expect(sPaymentCheckoutCompletedMock).toHaveBeenCalledWith(
            "order-id-1",
            "pi_test_123",
            "paid"
         );
         expect(console.error).toHaveBeenCalledTimes(1);
      });

      it("stripe - checkout.session.completed - success - test", async () => {
         const event = stripeTestData.checkoutSessionCompletedEvent();
         sPaymentCheckoutCompletedMock.mockResolvedValue(undefined);

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sPaymentCheckoutCompletedMock).toHaveBeenCalledTimes(1);
         expect(sPaymentCheckoutCompletedMock).toHaveBeenCalledWith(
            "order-id-1",
            "pi_test_123",
            "paid"
         );
         expect(console.error).not.toHaveBeenCalled();
      });
   });

   describe("checkout.session.expired tests", () => {
      it("stripe - checkout.session.expired - orderId null - test", async () => {
         const event = stripeTestData.checkoutSessionCompletedExpired();
         const session = event.data.object as Stripe.Checkout.Session;
         session.metadata = { orderId: undefined };

         await handleStripeEvent(event);

         const expectedPayload = { error: "Webhook processing failed" };
         const expectedStatus = { status: 500 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sStripeCheckoutExpiredMock).not.toHaveBeenCalled();
         expect(console.error).toHaveBeenCalledTimes(1);
      });

      it("stripe - checkout.session.expired - processing error - test", async () => {
         const event = stripeTestData.checkoutSessionCompletedExpired();
         sStripeCheckoutExpiredMock.mockRejectedValue(
            new Error("processing error")
         );

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sStripeCheckoutExpiredMock).toHaveBeenCalledTimes(1);
         expect(sStripeCheckoutExpiredMock).toHaveBeenCalledWith("order-id-1");
         expect(console.error).toHaveBeenCalledTimes(1);
      });

      it("stripe - checkout.session.expired - success - test", async () => {
         const event = stripeTestData.checkoutSessionCompletedExpired();
         sStripeCheckoutExpiredMock.mockResolvedValue(undefined);

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sStripeCheckoutExpiredMock).toHaveBeenCalledTimes(1);
         expect(sStripeCheckoutExpiredMock).toHaveBeenCalledWith("order-id-1");
         expect(console.error).not.toHaveBeenCalled();
      });
   });

   describe("payment_intent.payment_failed tests", () => {
      it("stripe - payment_intent.payment_failed - processing error - test", async () => {
         const event = stripeTestData.paymentIntentFailedEvent();
         sStripePaymentFailedMock.mockRejectedValue(
            new Error("processing error")
         );

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sStripePaymentFailedMock).toHaveBeenCalledTimes(1);
         expect(sStripePaymentFailedMock).toHaveBeenCalledWith(
            "payment-intent-id-1"
         );
         expect(console.error).toHaveBeenCalledTimes(1);
      });

      it("stripe - payment_intent.payment_failed - success - test", async () => {
         const event = stripeTestData.paymentIntentFailedEvent();
         sStripePaymentFailedMock.mockResolvedValue(undefined);

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sStripePaymentFailedMock).toHaveBeenCalledTimes(1);
         expect(sStripePaymentFailedMock).toHaveBeenCalledWith(
            "payment-intent-id-1"
         );
         expect(console.error).not.toHaveBeenCalled();
      });
   });

   describe("checkout.session.completed - subscription mode tests", () => {
      it("stripe - checkout.session.completed - subscription mode - processing error - test", async () => {
         const event = stripeTestData.checkoutSessionCompletedEvent(
            "subscription"
         );
         sHandleSubscriptionCheckoutCompletedMock.mockRejectedValue(
            new Error("processing error")
         );

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(
            sHandleSubscriptionCheckoutCompletedMock
         ).toHaveBeenCalledTimes(1);
         expect(console.error).toHaveBeenCalledTimes(1);
         expect(console.error).toHaveBeenCalledWith(
            "Error handling subscription checkout:",
            new Error("processing error")
         );
      });

      it("stripe - checkout.session.completed - subscription mode - success - test", async () => {
         const event = stripeTestData.checkoutSessionCompletedEvent(
            "subscription"
         );
         const session = event.data.object as Stripe.Checkout.Session;
         sHandleSubscriptionCheckoutCompletedMock.mockResolvedValue(undefined);

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(
            sHandleSubscriptionCheckoutCompletedMock
         ).toHaveBeenCalledTimes(1);
         expect(sHandleSubscriptionCheckoutCompletedMock).toHaveBeenCalledWith(
            session
         );
         expect(console.error).not.toHaveBeenCalled();
      });
   });

   describe("customer.subscription.created tests", () => {
      it("stripe - customer.subscription.created - processing error - test", async () => {
         const event = stripeTestData.subscriptionCreatedEvent();
         sHandleSubscriptionUpdatedMock.mockRejectedValue(
            new Error("processing error")
         );

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sHandleSubscriptionUpdatedMock).toHaveBeenCalledTimes(1);
         expect(console.error).toHaveBeenCalledTimes(1);
         expect(console.error).toHaveBeenCalledWith(
            "Error handling subscription update:",
            new Error("processing error")
         );
      });

      it("stripe - customer.subscription.created - success - test", async () => {
         const event = stripeTestData.subscriptionCreatedEvent();
         const subscription = event.data.object as Stripe.Subscription;
         sHandleSubscriptionUpdatedMock.mockResolvedValue(undefined);

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sHandleSubscriptionUpdatedMock).toHaveBeenCalledTimes(1);
         expect(sHandleSubscriptionUpdatedMock).toHaveBeenCalledWith(
            subscription
         );
         expect(console.error).not.toHaveBeenCalled();
      });
   });

   describe("customer.subscription.updated tests", () => {
      it("stripe - customer.subscription.updated - processing error - test", async () => {
         const event = stripeTestData.subscriptionUpdatedEvent();
         sHandleSubscriptionUpdatedMock.mockRejectedValue(
            new Error("processing error")
         );

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sHandleSubscriptionUpdatedMock).toHaveBeenCalledTimes(1);
         expect(console.error).toHaveBeenCalledTimes(1);
         expect(console.error).toHaveBeenCalledWith(
            "Error handling subscription update:",
            new Error("processing error")
         );
      });

      it("stripe - customer.subscription.updated - success - test", async () => {
         const event = stripeTestData.subscriptionUpdatedEvent();
         const subscription = event.data.object as Stripe.Subscription;
         sHandleSubscriptionUpdatedMock.mockResolvedValue(undefined);

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sHandleSubscriptionUpdatedMock).toHaveBeenCalledTimes(1);
         expect(sHandleSubscriptionUpdatedMock).toHaveBeenCalledWith(
            subscription
         );
         expect(console.error).not.toHaveBeenCalled();
      });
   });

   describe("customer.subscription.deleted tests", () => {
      it("stripe - customer.subscription.deleted - processing error - test", async () => {
         const event = stripeTestData.subscriptionDeletedEvent();
         sHandleSubscriptionDeletedMock.mockRejectedValue(
            new Error("processing error")
         );

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sHandleSubscriptionDeletedMock).toHaveBeenCalledTimes(1);
         expect(console.error).toHaveBeenCalledTimes(1);
         expect(console.error).toHaveBeenCalledWith(
            "Error handling subscription deletion:",
            new Error("processing error")
         );
      });

      it("stripe - customer.subscription.deleted - success - test", async () => {
         const event = stripeTestData.subscriptionDeletedEvent();
         const subscription = event.data.object as Stripe.Subscription;
         sHandleSubscriptionDeletedMock.mockResolvedValue(undefined);

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sHandleSubscriptionDeletedMock).toHaveBeenCalledTimes(1);
         expect(sHandleSubscriptionDeletedMock).toHaveBeenCalledWith(
            subscription
         );
         expect(console.error).not.toHaveBeenCalled();
      });
   });

   describe("invoice.payment_succeeded tests", () => {
      it("stripe - invoice.payment_succeeded - processing error - test", async () => {
         const event = stripeTestData.invoicePaymentSucceededEvent();
         sHandleInvoicePaymentSucceededMock.mockRejectedValue(
            new Error("processing error")
         );

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sHandleInvoicePaymentSucceededMock).toHaveBeenCalledTimes(1);
         expect(console.error).toHaveBeenCalledTimes(1);
         expect(console.error).toHaveBeenCalledWith(
            "Error handling invoice payment succeeded:",
            new Error("processing error")
         );
      });

      it("stripe - invoice.payment_succeeded - success - test", async () => {
         const event = stripeTestData.invoicePaymentSucceededEvent();
         const invoice = event.data.object as Stripe.Invoice;
         sHandleInvoicePaymentSucceededMock.mockResolvedValue(undefined);

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sHandleInvoicePaymentSucceededMock).toHaveBeenCalledTimes(1);
         expect(sHandleInvoicePaymentSucceededMock).toHaveBeenCalledWith(
            invoice
         );
         expect(console.error).not.toHaveBeenCalled();
      });
   });

   describe("invoice.payment_failed tests", () => {
      it("stripe - invoice.payment_failed - processing error - test", async () => {
         const event = stripeTestData.invoicePaymentFailedEvent();
         sHandleInvoicePaymentFailedMock.mockRejectedValue(
            new Error("processing error")
         );

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sHandleInvoicePaymentFailedMock).toHaveBeenCalledTimes(1);
         expect(console.error).toHaveBeenCalledTimes(1);
         expect(console.error).toHaveBeenCalledWith(
            "Error handling invoice payment failed:",
            new Error("processing error")
         );
      });

      it("stripe - invoice.payment_failed - success - test", async () => {
         const event = stripeTestData.invoicePaymentFailedEvent();
         const invoice = event.data.object as Stripe.Invoice;
         sHandleInvoicePaymentFailedMock.mockResolvedValue(undefined);

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sHandleInvoicePaymentFailedMock).toHaveBeenCalledTimes(1);
         expect(sHandleInvoicePaymentFailedMock).toHaveBeenCalledWith(invoice);
         expect(console.error).not.toHaveBeenCalled();
      });
   });

   describe("unknown event tests", () => {
      it("stripe - unknown event - test", async () => {
         const event: Stripe.Event = {
            id: "evt_test_123",
            type: "unknown.event",
            data: {
               object: {
                  id: "test-1",
               },
            },
         } as unknown as Stripe.Event;

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(console.log).toHaveBeenCalledTimes(1);
         expect(console.log).toHaveBeenCalledWith(
            "Unhandled event type: unknown.event"
         );
      });
   });
});
