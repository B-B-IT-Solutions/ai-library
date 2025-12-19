import Stripe from "stripe";

export const chargeSucceededEvent = (): Stripe.ChargeSucceededEvent => {
   return {
      type: "charge.succeeded",
      id: "charge-event-id-1",
      data: {
         object: {
            id: "object-id-1",
            amount: 132,
            metadata: {
               orderId: "order-id-1",
            } as Stripe.Metadata,
            billing_details: {
               email: "test1@email.com",
            },
         } as Stripe.Charge,
      },
   } as Stripe.ChargeSucceededEvent;
};

export const chargeSucceededFailed = (): Stripe.ChargeFailedEvent => {
   return {
      type: "charge.failed",
      id: "charge-event-id-1",
      data: {
         object: {
            id: "object-id-1",
            amount: 132,
            metadata: {
               orderId: "order-id-1",
            } as Stripe.Metadata,
            billing_details: {
               email: "test1@email.com",
            },
         } as Stripe.Charge,
      },
   } as Stripe.ChargeFailedEvent;
};

export const paymentIntent = (
   orderId: string | null = "order-id-1"
): Stripe.Response<Stripe.PaymentIntent> => {
   return {
      id: "payment-intent-id-1",
      object: "payment_intent",
      status: "succeeded",
      client_secret: "test-1-client-secret",
      metadata: {
         orderId: orderId,
      } as Stripe.Metadata,
   } as Stripe.Response<Stripe.PaymentIntent>;
};
