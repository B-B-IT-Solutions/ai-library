jest.mock("@/data/services/order");
jest.mock("next/server");

import { stripeTestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { OrderService } from "@/data/services/order";

import { handleStripeEvent } from "./stripe.event.handler";

const sStripeCheckoutCompleted =
   OrderService.prototype.handleStripeCheckoutCompleted;
const sStripeCheckoutExpired =
   OrderService.prototype.handleStripeCheckoutExpired;
const sStripePaymentFailed = OrderService.prototype.handleStripePaymentFailed;

const sStripeCheckoutCompletedMock =
   sStripeCheckoutCompleted as jest.MockedFunction<
      typeof sStripeCheckoutCompleted
   >;
const sStripeCheckoutExpiredMock =
   sStripeCheckoutExpired as jest.MockedFunction<typeof sStripeCheckoutExpired>;
const sStripePaymentFailedMock = sStripePaymentFailed as jest.MockedFunction<
   typeof sStripePaymentFailed
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

         expect(sStripeCheckoutCompletedMock).not.toHaveBeenCalled();
         expect(console.error).toHaveBeenCalledTimes(1);
      });

      it("stripe - checkout.session.completed - processing error - test", async () => {
         const event = stripeTestData.checkoutSessionCompletedEvent();
         sStripeCheckoutCompletedMock.mockRejectedValue(
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

         expect(sStripeCheckoutCompletedMock).toHaveBeenCalledTimes(1);
         expect(sStripeCheckoutCompletedMock).toHaveBeenCalledWith(
            "order-id-1",
            "pi_test_123",
            "paid"
         );
         expect(console.error).toHaveBeenCalledTimes(1);
      });

      it("stripe - checkout.session.completed - success - test", async () => {
         const event = stripeTestData.checkoutSessionCompletedEvent();
         sStripeCheckoutCompletedMock.mockResolvedValue(undefined);

         await handleStripeEvent(event);

         const expectedPayload = { received: true };
         const expectedStatus = { status: 200 };

         expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
         expect(nextResponseMock.json).toHaveBeenCalledWith(
            expectedPayload,
            expectedStatus
         );

         expect(sStripeCheckoutCompletedMock).toHaveBeenCalledTimes(1);
         expect(sStripeCheckoutCompletedMock).toHaveBeenCalledWith(
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
