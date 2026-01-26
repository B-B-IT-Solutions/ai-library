import Stripe from "stripe";

export const stripeCheckoutSession = (
   index = 1
): Stripe.Response<Stripe.Checkout.Session> => {
   return {
      id: "session-1",
      url: `https://checkout.stripe.com/session-${index}`,
   } as unknown as Stripe.Response<Stripe.Checkout.Session>;
};

export const stripeCustomer = (index = 1): Stripe.Response<Stripe.Customer> => {
   return {
      id: `cus_new123_${index}`,
   } as unknown as Stripe.Response<Stripe.Customer>;
};

export const checkoutSessionCompletedEvent = (): Stripe.Event => {
   return {
      type: "checkout.session.completed",
      id: "checkout-id-1",
      data: {
         object: {
            id: "object-id-1",
            amount: 132,
            payment_intent: "pi_test_123",
            payment_status: "paid",
            metadata: {
               orderId: "order-id-1",
            } as Stripe.Metadata,
            billing_details: {
               email: "test1@email.com",
            },
         } as unknown as Stripe.Checkout.Session,
      },
   } as unknown as Stripe.Event;
};

export const checkoutSessionCompletedExpired = (): Stripe.Event => {
   return {
      type: "checkout.session.expired",
      id: "checkout-id-1",
      data: {
         object: {
            id: "object-id-1",
            amount: 132,
            payment_intent: "pi_test_123",
            payment_status: "paid",
            metadata: {
               orderId: "order-id-1",
            } as Stripe.Metadata,
            billing_details: {
               email: "test1@email.com",
            },
         } as unknown as Stripe.Checkout.Session,
      },
   } as unknown as Stripe.Event;
};

export const paymentIntentFailedEvent = (): Stripe.Event => {
   return {
      type: "payment_intent.payment_failed",
      id: "checkout-id-1",
      data: {
         object: {
            id: "payment-intent-id-1",
            amount: 132,
            metadata: {
               orderId: "order-id-1",
            } as Stripe.Metadata,
            billing_details: {
               email: "test1@email.com",
            },
         } as unknown as Stripe.PaymentIntent,
      },
   } as unknown as Stripe.Event;
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
