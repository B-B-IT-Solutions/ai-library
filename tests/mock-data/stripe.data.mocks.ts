import { DeepPartial } from "react-hook-form";
import Stripe from "stripe";

export const stripeCheckoutSessionResponse = (
   index = 1
): Stripe.Response<Stripe.Checkout.Session> => {
   const session = stripeCheckoutSession(index);
   return session as Stripe.Response<Stripe.Checkout.Session>;
};

export const stripeCheckoutSession = (
   index = 1,
   customData?: DeepPartial<Stripe.Checkout.Session>
): Stripe.Checkout.Session => {
   return {
      id: `session-123-${index}`,
      url: `https://checkout.stripe.com/session-${index}`,
      ...customData,
   } as Stripe.Checkout.Session;
};

export const stripeCustomer = (index = 1): Stripe.Response<Stripe.Customer> => {
   return {
      id: `cus_new123_${index}`,
   } as unknown as Stripe.Response<Stripe.Customer>;
};

export const stripeSubscriptionResponse = (
   index = 1,
   customData?: DeepPartial<Stripe.Subscription>
): Stripe.Response<Stripe.Subscription> => {
   const subscription = stripeSubscription(index, customData);
   return subscription as Stripe.Response<Stripe.Subscription>;
};

export const stripeSubscription = (
   index = 1,
   customData?: DeepPartial<Stripe.Subscription>
): Stripe.Subscription => {
   return {
      id: `sub_test123_${index}`,
      cancel_at_period_end: true,
      ...customData,
   } as Stripe.Subscription;
};

export const stripeInvoice = (
   index = 1,
   customData?: DeepPartial<Stripe.Invoice>
): Stripe.Invoice => {
   return {
      id: `in_test_123_${index}`,
      ...customData,
   } as Stripe.Invoice;
};

export const billingPortalSession = (
   index = 1
): Stripe.Response<Stripe.BillingPortal.Session> => {
   return {
      id: `bps_test123_${index}`,
      url: `https://billing.stripe.com/session/${index}`,
   } as unknown as Stripe.Response<Stripe.BillingPortal.Session>;
};

export const checkoutSessionCompletedEvent = (
   mode: Stripe.Checkout.Session.Mode = "payment"
): Stripe.Event => {
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
            mode,
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

export const subscriptionCreatedEvent = (): Stripe.Event => {
   return {
      type: "customer.subscription.created",
      id: "evt_subscription_created_1",
      data: {
         object: {
            id: "sub_test_123",
            status: "active",
            customer: "cus_test_123",
            metadata: {
               userId: "user-123",
            } as Stripe.Metadata,
         } as unknown as Stripe.Subscription,
      },
   } as unknown as Stripe.Event;
};

export const subscriptionUpdatedEvent = (): Stripe.Event => {
   return {
      type: "customer.subscription.updated",
      id: "evt_subscription_updated_1",
      data: {
         object: {
            id: "sub_test_123",
            status: "active",
            customer: "cus_test_123",
            metadata: {
               userId: "user-123",
            } as Stripe.Metadata,
         } as unknown as Stripe.Subscription,
      },
   } as unknown as Stripe.Event;
};

export const subscriptionDeletedEvent = (): Stripe.Event => {
   return {
      type: "customer.subscription.deleted",
      id: "evt_subscription_deleted_1",
      data: {
         object: {
            id: "sub_test_123",
            status: "canceled",
            customer: "cus_test_123",
            metadata: {
               userId: "user-123",
            } as Stripe.Metadata,
         } as unknown as Stripe.Subscription,
      },
   } as unknown as Stripe.Event;
};

export const invoicePaymentSucceededEvent = (): Stripe.Event => {
   return {
      type: "invoice.payment_succeeded",
      id: "evt_invoice_payment_succeeded_1",
      data: {
         object: {
            id: "in_test_123",
            subscription: "sub_test_123",
            amount_paid: 9900,
            status: "paid",
         } as unknown as Stripe.Invoice,
      },
   } as unknown as Stripe.Event;
};

export const invoicePaymentFailedEvent = (): Stripe.Event => {
   return {
      type: "invoice.payment_failed",
      id: "evt_invoice_payment_failed_1",
      data: {
         object: {
            id: "in_test_123",
            subscription: "sub_test_123",
            amount_due: 9900,
            status: "open",
            attempt_count: 1,
         } as unknown as Stripe.Invoice,
      },
   } as unknown as Stripe.Event;
};
