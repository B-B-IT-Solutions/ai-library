jest.mock("@/lib/stripe/stripe-server");
jest.mock("./stripe.event.handler");

import { ntestData, stripeTestData } from "@tests";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

import { getStripe, getWebhookSecret } from "@/lib/stripe/stripe-server";

import { POST } from "./route";
import { handleStripeEvent } from "./stripe.event.handler";

const nextResponseMock = NextResponse as unknown as DeepMockProxy<NextResponse>;
const nextRequestMock = NextRequest as unknown as DeepMockProxy<NextRequest>;

export const stripeMock = mockDeep<Stripe>({
   funcPropSupport: true,
}) as DeepMockProxy<Stripe>;

const stripeWeebhookSecretMock = "webhook-secret-1";

const getStripeMock = getStripe as jest.MockedFunction<typeof getStripe>;

const getWebhookSecretMock = getWebhookSecret as jest.MockedFunction<
   typeof getWebhookSecret
>;

const handleStripeEventMock = handleStripeEvent as jest.MockedFunction<
   typeof handleStripeEvent
>;
const headersMock = headers as jest.MockedFunction<typeof headers>;

describe("POST tests", () => {
   beforeEach(() => {
      jest.clearAllMocks();

      getStripeMock.mockReturnValue(stripeMock);
      getWebhookSecretMock.mockReturnValue(stripeWeebhookSecretMock);
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
         stripeWeebhookSecretMock
      );
      expect(handleStripeEventMock).not.toHaveBeenCalled();
   });

   it("POST - event processed - test", async () => {
      const body = "test body";
      const signature = "test-sign-1";
      const stripeEvent =
         stripeTestData.checkoutSessionCompletedEvent("payment");
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
         stripeWeebhookSecretMock
      );
      expect(handleStripeEventMock).toHaveBeenCalledTimes(1);
      expect(handleStripeEventMock).toHaveBeenCalledWith(stripeEvent);
   });
});
