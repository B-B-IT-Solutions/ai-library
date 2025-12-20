jest.mock("@/data/actions/order/order.actions");

import { stripeTestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import {
   handleStripeCheckoutCompleted,
   handleStripeCheckoutExpired,
   handleStripePaymentFailed,
} from "@/data/actions/order/order.actions";

import { handleStripeEvent } from "./stripe.event.handler";

const nextResponseMock = NextResponse as unknown as DeepMockProxy<NextResponse>;

const handleStripeCheckoutCompletedMock =
   handleStripeCheckoutCompleted as jest.MockedFunction<
      typeof handleStripeCheckoutCompleted
   >;

const handleStripeCheckoutExpiredMock =
   handleStripeCheckoutExpired as jest.MockedFunction<
      typeof handleStripeCheckoutExpired
   >;

const handleStripePaymentFailedMock =
   handleStripePaymentFailed as jest.MockedFunction<
      typeof handleStripePaymentFailed
   >;

describe("handleStripeEvent tests", () => {
   const originalConsoleLog = console.log;
   const originalConsoleError = console.error;

   beforeEach(() => {
      jest.resetAllMocks();
      console.log = jest.fn();
      console.error = jest.fn();
   });

   afterEach(() => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
   });

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

      expect(handleStripeCheckoutCompletedMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("stripe - checkout.session.completed - processing error - test", async () => {
      const event = stripeTestData.checkoutSessionCompletedEvent();
      handleStripeCheckoutCompletedMock.mockResolvedValue({
         success: false,
         message: "processing error",
      });

      await handleStripeEvent(event);

      const expectedPayload = { received: true };
      const expectedStatus = { status: 200 };

      expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
      expect(nextResponseMock.json).toHaveBeenCalledWith(
         expectedPayload,
         expectedStatus
      );

      expect(handleStripeCheckoutCompletedMock).toHaveBeenCalledTimes(1);
      expect(handleStripeCheckoutCompletedMock).toHaveBeenCalledWith(
         "order-id-1",
         "pi_test_123",
         "paid"
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("stripe - checkout.session.completed - success - test", async () => {
      const event = stripeTestData.checkoutSessionCompletedEvent();

      handleStripeCheckoutCompletedMock.mockResolvedValue({
         success: true,
         message: "Order completed successfully",
      });

      await handleStripeEvent(event);

      const expectedPayload = { received: true };
      const expectedStatus = { status: 200 };

      expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
      expect(nextResponseMock.json).toHaveBeenCalledWith(
         expectedPayload,
         expectedStatus
      );

      expect(handleStripeCheckoutCompletedMock).toHaveBeenCalledTimes(1);
      expect(handleStripeCheckoutCompletedMock).toHaveBeenCalledWith(
         "order-id-1",
         "pi_test_123",
         "paid"
      );
      expect(console.error).not.toHaveBeenCalled();
   });

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

      expect(handleStripeCheckoutExpiredMock).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("stripe - checkout.session.expired - processing error - test", async () => {
      const event = stripeTestData.checkoutSessionCompletedExpired();
      handleStripeCheckoutExpiredMock.mockResolvedValue({
         success: false,
         message: "processing error",
      });

      await handleStripeEvent(event);

      const expectedPayload = { received: true };
      const expectedStatus = { status: 200 };

      expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
      expect(nextResponseMock.json).toHaveBeenCalledWith(
         expectedPayload,
         expectedStatus
      );

      expect(handleStripeCheckoutExpiredMock).toHaveBeenCalledTimes(1);
      expect(handleStripeCheckoutExpiredMock).toHaveBeenCalledWith(
         "order-id-1"
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("stripe - checkout.session.expired - success - test", async () => {
      const event = stripeTestData.checkoutSessionCompletedExpired();

      handleStripeCheckoutExpiredMock.mockResolvedValue({
         success: true,
         message: "Order completed successfully",
      });

      await handleStripeEvent(event);

      const expectedPayload = { received: true };
      const expectedStatus = { status: 200 };

      expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
      expect(nextResponseMock.json).toHaveBeenCalledWith(
         expectedPayload,
         expectedStatus
      );

      expect(handleStripeCheckoutExpiredMock).toHaveBeenCalledTimes(1);
      expect(handleStripeCheckoutExpiredMock).toHaveBeenCalledWith(
         "order-id-1"
      );
      expect(console.error).not.toHaveBeenCalled();
   });

   it("stripe - payment_intent.payment_failed - orderId null - test", async () => {
      const event = stripeTestData.paymentIntentFailedEvent();
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

      expect(handleStripePaymentFailedMock).toHaveBeenCalledTimes(1);
      expect(handleStripePaymentFailedMock).toHaveBeenCalledWith(
         "payment-intent-id-1"
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("stripe - payment_intent.payment_failed - processing error - test", async () => {
      const event = stripeTestData.paymentIntentFailedEvent();
      handleStripePaymentFailedMock.mockResolvedValue({
         success: false,
         message: "processing error",
      });

      await handleStripeEvent(event);

      const expectedPayload = { received: true };
      const expectedStatus = { status: 200 };

      expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
      expect(nextResponseMock.json).toHaveBeenCalledWith(
         expectedPayload,
         expectedStatus
      );

      expect(handleStripePaymentFailedMock).toHaveBeenCalledTimes(1);
      expect(handleStripePaymentFailedMock).toHaveBeenCalledWith(
         "payment-intent-id-1"
      );
      expect(console.error).toHaveBeenCalledTimes(1);
   });

   it("stripe - payment_intent.payment_failed - success - test", async () => {
      const event = stripeTestData.paymentIntentFailedEvent();

      handleStripePaymentFailedMock.mockResolvedValue({
         success: true,
         message: "Order completed successfully",
      });

      await handleStripeEvent(event);

      const expectedPayload = { received: true };
      const expectedStatus = { status: 200 };

      expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
      expect(nextResponseMock.json).toHaveBeenCalledWith(
         expectedPayload,
         expectedStatus
      );

      expect(handleStripePaymentFailedMock).toHaveBeenCalledTimes(1);
      expect(handleStripePaymentFailedMock).toHaveBeenCalledWith(
         "payment-intent-id-1"
      );
      expect(console.error).not.toHaveBeenCalled();
   });

   it("stripe - unknow event - test", async () => {
      const event: Stripe.Event = {
         id: "evt_test_123",
         type: "unknow.event",
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
   });
});
