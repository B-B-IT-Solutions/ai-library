jest.mock("@/lib/stripe/stripe-server");
jest.mock("./stripe.event.handler");

import { ntestData, stripeTestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { STRIPE_WEBHOOK_SECRET } from "@/lib/constants";
import { stripe } from "@/lib/stripe/stripe-server";

import { POST } from "./route";
import { handleStripeEvent } from "./stripe.event.handler";

const nextResponseMock = NextResponse as unknown as DeepMockProxy<NextResponse>;
const nextRequestMock = NextRequest as unknown as DeepMockProxy<NextRequest>;

export const stripeMock = stripe as unknown as DeepMockProxy<Stripe>;
const handleStripeEventMock = handleStripeEvent as jest.MockedFunction<
   typeof handleStripeEvent
>;
const headersMock = headers as jest.MockedFunction<typeof headers>;

describe("POST tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("POST - signature null - test", async () => {
      const body = "test body";
      nextRequestMock.text.mockResolvedValue(body);

      const headers = {};
      const reqHeader = ntestData.headers(headers);
      headersMock.mockResolvedValue(reqHeader);

      await POST(nextRequestMock);

      const expectedPayload = { error: "No signature provided" };
      const expectedStatus = { status: 400 };

      expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
      expect(nextResponseMock.json).toHaveBeenCalledWith(
         expectedPayload,
         expectedStatus
      );
      expect(stripeMock.webhooks.constructEvent).not.toHaveBeenCalled();
      expect(handleStripeEventMock).not.toHaveBeenCalled();
   });

   it("POST - signature invalid - test", async () => {
      const body = "test body";
      const signature = "test-sign-1";
      nextRequestMock.text.mockResolvedValue(body);
      stripeMock.webhooks.constructEvent.mockImplementation(() => {
         throw new Error("invalid signature");
      });

      const headers = { "stripe-signature": signature };
      const reqHeader = ntestData.headers(headers);
      headersMock.mockResolvedValue(reqHeader);

      await POST(nextRequestMock);

      const expectedPayload = { error: "Invalid signature" };
      const expectedStatus = { status: 400 };

      expect(nextResponseMock.json).toHaveBeenCalledTimes(1);
      expect(nextResponseMock.json).toHaveBeenCalledWith(
         expectedPayload,
         expectedStatus
      );
      expect(stripeMock.webhooks.constructEvent).toHaveBeenCalledTimes(1);
      expect(stripeMock.webhooks.constructEvent).toHaveBeenCalledWith(
         body,
         signature,
         STRIPE_WEBHOOK_SECRET
      );
      expect(handleStripeEventMock).not.toHaveBeenCalled();
   });

   it("POST - event processed - test", async () => {
      const body = "test body";
      const signature = "test-sign-1";
      const stripeEvent = stripeTestData.chargeSucceededEvent();
      const response = NextResponse.json({ received: true }, { status: 200 });

      nextRequestMock.text.mockResolvedValue(body);
      stripeMock.webhooks.constructEvent.mockReturnValue(stripeEvent);
      handleStripeEventMock.mockResolvedValue(response);

      const headers = { "stripe-signature": signature };
      const reqHeader = ntestData.headers(headers);
      headersMock.mockResolvedValue(reqHeader);

      const result = await POST(nextRequestMock);

      expect(result).toEqual(response);
      expect(stripeMock.webhooks.constructEvent).toHaveBeenCalledTimes(1);
      expect(stripeMock.webhooks.constructEvent).toHaveBeenCalledWith(
         body,
         signature,
         STRIPE_WEBHOOK_SECRET
      );
      expect(handleStripeEventMock).toHaveBeenCalledTimes(1);
      expect(handleStripeEventMock).toHaveBeenCalledWith(stripeEvent);
   });
});
