jest.mock("@/data/services/cart");
jest.mock("@/data/services/order");
jest.mock("@/data/services/subscription");
jest.mock("@/data/services/user");
jest.mock("@/lib/stripe/stripe-server");
jest.mock("@/data/actions/auth-utils");

import { dtestData, stripeTestData } from "@tests";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import Stripe from "stripe";

import { requireUser } from "@/data/actions/auth-utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { CartService } from "@/data/services/cart";
import { OrderService } from "@/data/services/order";
import { SubscriptionService } from "@/data/services/subscription";
import { UserService } from "@/data/services/user";
import { DOrderUpdate } from "@/data/types/domain/order";
import {
   DStripeBillingPortalSessionResponse,
   DStripeCheckoutResponse,
} from "@/data/types/domain/stripe";
import {
   DCreateSubscriptionCheckout,
   DSubscriptionCreate,
   DSubscriptionHistoryCreate,
   DSubscriptionUpdate,
} from "@/data/types/domain/subscription";
import { getStripe } from "@/lib/stripe/stripe-server";

import { StripeService } from "./stripe.service";
import { cartToOrderCreate } from "./utils";

const sCreateOrder = OrderService.prototype.createOrder;
const sUpdateOrder = OrderService.prototype.updateOrder;

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;
const sCreateOrderMock = sCreateOrder as jest.MockedFunction<
   typeof sCreateOrder
>;
const sUpdateOrderMock = sUpdateOrder as jest.MockedFunction<
   typeof sUpdateOrder
>;

export const stripeMock = mockDeep<Stripe>({
   funcPropSupport: true,
}) as DeepMockProxy<Stripe>;

const getStripeMock = getStripe as jest.MockedFunction<typeof getStripe>;

const serviceFactory = new ServiceFactory(prisma);
const cartService = serviceFactory.getCartService();
const orderService = serviceFactory.getOrderService();
const subscriptionService = serviceFactory.getSubscriptionService();
const userService = serviceFactory.getUserService();

const cartServiceMock = cartService as DeepMockProxy<CartService>;
const orderServiceMock = orderService as DeepMockProxy<OrderService>;
const subscriptionServiceMock =
   subscriptionService as DeepMockProxy<SubscriptionService>;
const userServiceMock = userService as DeepMockProxy<UserService>;

const stripeService = new StripeService(
   cartServiceMock,
   orderServiceMock,
   subscriptionServiceMock,
   userServiceMock
);

describe("createOrderCheckoutSession tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      getStripeMock.mockReturnValue(stripeMock);
   });

   it("createOrderCheckoutSession - user not authenticated - test", async () => {
      const error = new Error("Authentication required");
      requireUserMock.mockRejectedValue(error);

      await expect(stripeService.createOrderCheckoutSession()).rejects.toThrow(
         "Authentication required"
      );
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).not.toHaveBeenCalled();
      expect(sCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(sUpdateOrderMock).not.toHaveBeenCalled();
   });

   it("createOrderCheckoutSession - cart empty - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const cart = dtestData.dCart(1, 0);

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);

      await expect(stripeService.createOrderCheckoutSession()).rejects.toThrow(
         "Your cart is empty."
      );

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(sUpdateOrderMock).not.toHaveBeenCalled();
   });

   it("createOrderCheckoutSession - successful checkout with single item - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = dtestData.dCart(1, 1);

      const order = dtestData.dOrder();
      const checkoutSession = stripeTestData.stripeCheckoutSessionResponse();

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);
      sCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result = await stripeService.createOrderCheckoutSession();

      const expectedResult: DStripeCheckoutResponse = {
         sessionId: checkoutSession.id,
         url: checkoutSession.url as string,
      };

      const item1 = cart.items[0];

      const expectedStripeCheckoutPayload: Stripe.Checkout.SessionCreateParams =
         {
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
               {
                  price_data: {
                     currency: "chf",
                     product_data: {
                        name: item1.productName,
                        description: item1.productDescription,
                     },
                     unit_amount: 1999,
                  },
                  quantity: 1,
               },
            ],
            customer_email: user.email as string,
            client_reference_id: order.id,
            metadata: {
               orderId: order.id,
               userId: user.id,
            },
            success_url: `http://localhost:3000/orders/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: "http://localhost:3000/checkout?canceled=true",
         };

      const expectedDUpdatePayload: DOrderUpdate = {
         stripeCheckoutSessionId: checkoutSession.id,
         stripePaymentStatus: "unpaid",
      };

      const expectedOrderCreatePayload = cartToOrderCreate(cart);

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledWith(
         user.id,
         expectedOrderCreatePayload
      );

      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
         expectedStripeCheckoutPayload
      );

      expect(sUpdateOrderMock).toHaveBeenCalledTimes(1);
      expect(sUpdateOrderMock).toHaveBeenCalledWith(
         order.id,
         expectedDUpdatePayload
      );
   });

   it("createOrderCheckoutSession - successful checkout with multiple items - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const cart = dtestData.dCart(1, 2);
      const order = dtestData.dOrder();
      const item1 = cart.items[0];
      const item2 = cart.items[1];
      item2.productDescription = undefined;

      const checkoutSession = stripeTestData.stripeCheckoutSessionResponse();

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);
      sCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result = await stripeService.createOrderCheckoutSession();

      const expectedResult: DStripeCheckoutResponse = {
         sessionId: checkoutSession.id,
         url: checkoutSession.url as string,
      };

      const expectedStripeCheckoutPayload: Stripe.Checkout.SessionCreateParams =
         {
            mode: "payment",
            payment_method_types: ["card"],
            line_items: [
               {
                  price_data: {
                     currency: "chf",
                     product_data: {
                        name: item1.productName,
                        description: item1.productDescription,
                     },
                     unit_amount: 1999,
                  },
                  quantity: 1,
               },
               {
                  price_data: {
                     currency: "chf",
                     product_data: {
                        name: item2.productName,
                        description: undefined,
                     },
                     unit_amount: 1999,
                  },
                  quantity: 1,
               },
            ],
            customer_email: user.email,
            client_reference_id: order.id,
            metadata: {
               orderId: order.id,
               userId: user.id,
            },
            success_url: `http://localhost:3000/orders/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: "http://localhost:3000/checkout?canceled=true",
         };

      const expectedDUpdatePayload: DOrderUpdate = {
         stripeCheckoutSessionId: checkoutSession.id,
         stripePaymentStatus: "unpaid",
      };

      const expectedOrderCreatePayload = cartToOrderCreate(cart);

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledWith(
         user.id,
         expectedOrderCreatePayload
      );

      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
         expectedStripeCheckoutPayload
      );

      expect(sUpdateOrderMock).toHaveBeenCalledTimes(1);
      expect(sUpdateOrderMock).toHaveBeenCalledWith(
         order.id,
         expectedDUpdatePayload
      );
   });

   it("createOrderCheckoutSession - user with no email - test", async () => {
      const user = dtestData.dLoginUser();
      user.email = null;
      const cart = dtestData.dCart(1, 1);
      const order = dtestData.dOrder(1);
      const checkoutSession = stripeTestData.stripeCheckoutSessionResponse();

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);
      sCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result = await stripeService.createOrderCheckoutSession();
      const expectedResult: DStripeCheckoutResponse = {
         sessionId: checkoutSession.id,
         url: checkoutSession.url as string,
      };

      expect(result).toEqual(expectedResult);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
         expect.objectContaining({
            customer_email: undefined,
         })
      );
   });
});

describe("createSubscriptionCheckoutSession tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      getStripeMock.mockReturnValue(stripeMock);
   });

   it("createSubscriptionCheckoutSession - successful checkout with monthly billing - test", async () => {
      const plan = dtestData.dSubscriptionPlan(1);
      const stripeCustomer = stripeTestData.stripeCustomer();
      const checkoutSession = stripeTestData.stripeCheckoutSessionResponse();
      const params: DCreateSubscriptionCheckout = {
         userId: "user-1",
         userEmail: "test@email.com",
         planId: plan.id,
         billingInterval: "MONTHLY",
      };

      subscriptionServiceMock.getPlanById.mockResolvedValue(plan);
      userServiceMock.getUserStripeCustomerId.mockResolvedValue(
         stripeCustomer.id
      );
      subscriptionServiceMock.getSubscription.mockResolvedValue(null);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result =
         await stripeService.createSubscriptionCheckoutSession(params);

      const expectedResult: DStripeCheckoutResponse = {
         sessionId: checkoutSession.id,
         url: checkoutSession.url as string,
      };

      expect(result).toEqual(expectedResult);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledWith(plan.id);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledWith(
         params.userId
      );
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         params.userId
      );

      const expectedSessionParams: Stripe.Checkout.SessionCreateParams = {
         mode: "subscription",
         payment_method_types: ["card"],
         line_items: [
            {
               price: plan.stripePriceIdMonthly as string,
               quantity: 1,
            },
         ],
         customer: stripeCustomer.id,
         client_reference_id: params.userId,
         metadata: {
            userId: params.userId,
            planId: params.planId,
            billingInterval: params.billingInterval,
         },
         success_url: `http://localhost:3000/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: "http://localhost:3000/subscription/pricing",
         subscription_data: {
            metadata: {
               userId: params.userId,
               planId: params.planId,
            },
         },
      };

      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
         expectedSessionParams
      );

      const expectedSubscriptionData: DSubscriptionCreate = {
         userId: params.userId,
         planId: params.planId,
         billingInterval: params.billingInterval,
         stripeCheckoutSessionId: checkoutSession.id,
         stripeCustomerId: stripeCustomer.id,
      };
      expect(subscriptionServiceMock.createSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.createSubscription).toHaveBeenCalledWith(
         expectedSubscriptionData
      );

      const expectedHistoryParams: DSubscriptionHistoryCreate = {
         userId: params.userId,
         eventType: "checkout_created",
         toTier: plan.tier,
         toStatus: "INCOMPLETE",
         metadata: {
            stripeCheckoutSessionId: checkoutSession.id,
            billingInterval: params.billingInterval,
         },
      };
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledWith(expectedHistoryParams);
   });

   it("createSubscriptionCheckoutSession - successful checkout with yearly billing - test", async () => {
      const plan = dtestData.dSubscriptionPlan(1);
      const stripeCustomer = stripeTestData.stripeCustomer();
      const checkoutSession = stripeTestData.stripeCheckoutSessionResponse();
      const params: DCreateSubscriptionCheckout = {
         userId: "user-1",
         userEmail: "test@email.com",
         planId: plan.id,
         billingInterval: "YEARLY",
      };

      subscriptionServiceMock.getPlanById.mockResolvedValue(plan);
      userServiceMock.getUserStripeCustomerId.mockResolvedValue(
         stripeCustomer.id
      );
      subscriptionServiceMock.getSubscription.mockResolvedValue(null);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result =
         await stripeService.createSubscriptionCheckoutSession(params);

      const expectedResult: DStripeCheckoutResponse = {
         sessionId: checkoutSession.id,
         url: checkoutSession.url as string,
      };

      expect(result).toEqual(expectedResult);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledWith(plan.id);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledWith(
         params.userId
      );
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         params.userId
      );

      const expectedSessionParams: Stripe.Checkout.SessionCreateParams = {
         mode: "subscription",
         payment_method_types: ["card"],
         line_items: [
            {
               price: plan.stripePriceIdYearly as string,
               quantity: 1,
            },
         ],
         customer: stripeCustomer.id,
         client_reference_id: params.userId,
         metadata: {
            userId: params.userId,
            planId: params.planId,
            billingInterval: params.billingInterval,
         },
         success_url: `http://localhost:3000/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
         cancel_url: "http://localhost:3000/subscription/pricing",
         subscription_data: {
            metadata: {
               userId: params.userId,
               planId: params.planId,
            },
         },
      };

      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
         expectedSessionParams
      );

      const expectedSubscriptionData: DSubscriptionCreate = {
         userId: params.userId,
         planId: params.planId,
         billingInterval: params.billingInterval,
         stripeCheckoutSessionId: checkoutSession.id,
         stripeCustomerId: stripeCustomer.id,
      };
      expect(subscriptionServiceMock.createSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.createSubscription).toHaveBeenCalledWith(
         expectedSubscriptionData
      );

      const expectedHistoryParams: DSubscriptionHistoryCreate = {
         userId: params.userId,
         eventType: "checkout_created",
         toTier: plan.tier,
         toStatus: "INCOMPLETE",
         metadata: {
            stripeCheckoutSessionId: checkoutSession.id,
            billingInterval: params.billingInterval,
         },
      };
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledWith(expectedHistoryParams);
   });

   it("createSubscriptionCheckoutSession - creates new Stripe customer if none exists - test", async () => {
      const plan = dtestData.dSubscriptionPlan(1);
      const stripeCustomer = stripeTestData.stripeCustomer();
      const checkoutSession = stripeTestData.stripeCheckoutSessionResponse();
      const params: DCreateSubscriptionCheckout = {
         userId: "user-1",
         userEmail: "test@email.com",
         planId: plan.id,
         billingInterval: "MONTHLY",
      };

      subscriptionServiceMock.getPlanById.mockResolvedValue(plan);
      userServiceMock.getUserStripeCustomerId.mockResolvedValue(null);
      stripeMock.customers.create.mockResolvedValue(stripeCustomer);
      subscriptionServiceMock.getSubscription.mockResolvedValue(null);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result =
         await stripeService.createSubscriptionCheckoutSession(params);

      const expectedResult: DStripeCheckoutResponse = {
         sessionId: checkoutSession.id,
         url: checkoutSession.url as string,
      };

      expect(result).toEqual(expectedResult);

      const expectedCreateCustomerData: Stripe.CustomerCreateParams = {
         email: params.userEmail,
         metadata: {
            userId: params.userId,
         },
      };
      expect(stripeMock.customers.create).toHaveBeenCalledTimes(1);
      expect(stripeMock.customers.create).toHaveBeenCalledWith(
         expectedCreateCustomerData
      );
      expect(userServiceMock.updateUserStripeCustomerId).toHaveBeenCalledTimes(
         1
      );
      expect(userServiceMock.updateUserStripeCustomerId).toHaveBeenCalledWith(
         params.userId,
         stripeCustomer.id
      );
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
         expect.objectContaining({
            customer: stripeCustomer.id,
         })
      );
   });

   it("createSubscriptionCheckoutSession - deletes existing incomplete subscription - test", async () => {
      const plan = dtestData.dSubscriptionPlan(1);
      const stripeCustomer = stripeTestData.stripeCustomer();
      const checkoutSession = stripeTestData.stripeCheckoutSessionResponse();
      const existingSubscription = dtestData.dSubscription(1);
      existingSubscription.status = "INCOMPLETE";
      const params: DCreateSubscriptionCheckout = {
         userId: "user-1",
         userEmail: "test@email.com",
         planId: plan.id,
         billingInterval: "MONTHLY" as const,
      };

      subscriptionServiceMock.getPlanById.mockResolvedValue(plan);
      userServiceMock.getUserStripeCustomerId.mockResolvedValue(
         stripeCustomer.id
      );
      subscriptionServiceMock.getSubscription.mockResolvedValue(
         existingSubscription
      );
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result =
         await stripeService.createSubscriptionCheckoutSession(params);

      const expectedResult: DStripeCheckoutResponse = {
         sessionId: checkoutSession.id,
         url: checkoutSession.url as string,
      };
      expect(result).toEqual(expectedResult);

      expect(subscriptionServiceMock.deleteSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.deleteSubscription).toHaveBeenCalledWith(
         params.userId
      );
   });

   it("createSubscriptionCheckoutSession - does not delete existing active subscription - test", async () => {
      const plan = dtestData.dSubscriptionPlan(1);
      const stripeCustomer = stripeTestData.stripeCustomer();
      const checkoutSession = stripeTestData.stripeCheckoutSessionResponse();
      const existingSubscription = dtestData.dSubscription(1);
      existingSubscription.status = "ACTIVE";
      const params: DCreateSubscriptionCheckout = {
         userId: "user-1",
         userEmail: "test@email.com",
         planId: plan.id,
         billingInterval: "MONTHLY" as const,
      };

      subscriptionServiceMock.getPlanById.mockResolvedValue(plan);
      userServiceMock.getUserStripeCustomerId.mockResolvedValue(
         stripeCustomer.id
      );
      subscriptionServiceMock.getSubscription.mockResolvedValue(
         existingSubscription
      );
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result =
         await stripeService.createSubscriptionCheckoutSession(params);

      const expectedResult: DStripeCheckoutResponse = {
         sessionId: checkoutSession.id,
         url: checkoutSession.url as string,
      };

      expect(result).toEqual(expectedResult);

      expect(subscriptionServiceMock.deleteSubscription).not.toHaveBeenCalled();
   });

   it("createSubscriptionCheckoutSession - throws error when monthly price not configured - test", async () => {
      const plan = dtestData.dSubscriptionPlan(1);
      plan.stripePriceIdMonthly = null;
      const params: DCreateSubscriptionCheckout = {
         userId: "user-1",
         userEmail: "test@email.com",
         planId: plan.id,
         billingInterval: "MONTHLY" as const,
      };

      subscriptionServiceMock.getPlanById.mockResolvedValue(plan);

      const fn = () => stripeService.createSubscriptionCheckoutSession(params);
      await expect(fn).rejects.toThrow(
         "No Stripe price configured for MONTHLY billing"
      );

      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledWith(plan.id);
      expect(userServiceMock.getUserStripeCustomerId).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.getSubscription).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.createSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
   });

   it("createSubscriptionCheckoutSession - throws error when yearly price not configured - test", async () => {
      const plan = dtestData.dSubscriptionPlan(1);
      plan.stripePriceIdYearly = null;
      const params: DCreateSubscriptionCheckout = {
         userId: "user-1",
         userEmail: "test@email.com",
         planId: plan.id,
         billingInterval: "YEARLY" as const,
      };

      subscriptionServiceMock.getPlanById.mockResolvedValue(plan);

      const fn = () => stripeService.createSubscriptionCheckoutSession(params);
      await expect(fn).rejects.toThrow(
         "No Stripe price configured for YEARLY billing"
      );

      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledWith(plan.id);
      expect(userServiceMock.getUserStripeCustomerId).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.getSubscription).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.createSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
   });

   it("createSubscriptionCheckoutSession - stripe.checkout.sessions.create throws error - test", async () => {
      const plan = dtestData.dSubscriptionPlan(1);
      const stripeCustomer = stripeTestData.stripeCustomer();
      const error = new Error("Stripe API error");
      const params: DCreateSubscriptionCheckout = {
         userId: "user-1",
         userEmail: "test@email.com",
         planId: plan.id,
         billingInterval: "MONTHLY" as const,
      };

      subscriptionServiceMock.getPlanById.mockResolvedValue(plan);
      userServiceMock.getUserStripeCustomerId.mockResolvedValue(
         stripeCustomer.id
      );
      subscriptionServiceMock.getSubscription.mockResolvedValue(null);
      stripeMock.checkout.sessions.create.mockRejectedValue(error);

      const fn = () => stripeService.createSubscriptionCheckoutSession(params);
      await expect(fn).rejects.toThrow("Stripe API error");

      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledWith(plan.id);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledWith(
         params.userId
      );
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         params.userId
      );

      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.createSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });
});

describe("cancelSubscription tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      getStripeMock.mockReturnValue(stripeMock);
   });

   it("cancelSubscription - successful cancellation - test", async () => {
      const userId = "user-1";
      const stripeSubscription = stripeTestData.stripeSubscriptionResponse();
      const subscription = dtestData.dSubscription(1);
      subscription.stripeSubscriptionId = stripeSubscription.id;
      subscription.status = "ACTIVE";
      subscription.currentPeriodEnd = new Date("2026-01-26").toISOString();

      subscriptionServiceMock.getSubscription.mockResolvedValue(subscription);
      stripeMock.subscriptions.update.mockResolvedValue(stripeSubscription);

      await stripeService.cancelSubscription(userId);

      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );

      const expectedStripeUpdateParams: Stripe.SubscriptionUpdateParams = {
         cancel_at_period_end: true,
      };
      expect(stripeMock.subscriptions.update).toHaveBeenCalledTimes(1);
      expect(stripeMock.subscriptions.update).toHaveBeenCalledWith(
         subscription.stripeSubscriptionId,
         expectedStripeUpdateParams
      );

      const expectedUpdateParams: DSubscriptionUpdate = {
         cancelAtPeriodEnd: true,
         canceledAt: expect.any(Date),
      };
      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledWith(
         userId,
         expectedUpdateParams
      );

      const expectedHistoryParams: DSubscriptionHistoryCreate = {
         userId,
         eventType: "canceled",
         fromStatus: subscription.status,
         toStatus: subscription.status,
         metadata: {
            cancelAtPeriodEnd: true,
            currentPeriodEnd: subscription.currentPeriodEnd,
         },
      };
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledWith(expectedHistoryParams);
   });

   it("cancelSubscription - throws error when no subscription found - test", async () => {
      const userId = "user-1";

      subscriptionServiceMock.getSubscription.mockResolvedValue(null);

      const fn = () => stripeService.cancelSubscription(userId);

      await expect(fn).rejects.toThrow("No subscription found");

      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.subscriptions.update).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.updateSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });

   it("cancelSubscription - throws error when no Stripe subscription ID - test", async () => {
      const userId = "user-1";
      const subscription = dtestData.dSubscription(1);
      subscription.stripeSubscriptionId = null;

      subscriptionServiceMock.getSubscription.mockResolvedValue(subscription);

      const fn = () => stripeService.cancelSubscription(userId);

      await expect(fn).rejects.toThrow("No Stripe subscription found");

      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.subscriptions.update).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.updateSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });

   it("cancelSubscription - handles subscription with different statuses - test", async () => {
      const userId = "user-1";
      const stripeSubscriptionId = "sub_test123";
      const subscription = dtestData.dSubscription(1);
      subscription.stripeSubscriptionId = stripeSubscriptionId;
      subscription.status = "PAST_DUE";
      subscription.currentPeriodEnd = new Date("2026-01-26").toISOString();

      const stripeSubscription = stripeTestData.stripeSubscriptionResponse(1, {
         id: "sub_test123",
         cancel_at_period_end: true,
      });

      subscriptionServiceMock.getSubscription.mockResolvedValue(subscription);
      stripeMock.subscriptions.update.mockResolvedValue(stripeSubscription);

      await stripeService.cancelSubscription(userId);

      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledWith({
         userId,
         eventType: "canceled",
         fromStatus: "PAST_DUE",
         toStatus: "PAST_DUE",
         metadata: {
            cancelAtPeriodEnd: true,
            currentPeriodEnd: subscription.currentPeriodEnd,
         },
      });
   });
});

describe("reactivateSubscription tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      getStripeMock.mockReturnValue(stripeMock);
   });

   it("reactivateSubscription - successful reactivation - test", async () => {
      const userId = "user-1";
      const stripeSubscription = stripeTestData.stripeSubscriptionResponse();
      stripeSubscription.cancel_at_period_end = false;
      const subscription = dtestData.dSubscription(1);
      subscription.stripeSubscriptionId = stripeSubscription.id;
      subscription.status = "ACTIVE";
      subscription.cancelAtPeriodEnd = true;

      subscriptionServiceMock.getSubscription.mockResolvedValue(subscription);
      stripeMock.subscriptions.update.mockResolvedValue(stripeSubscription);

      await stripeService.reactivateSubscription(userId);

      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );

      const expectedStripeUpdateParams: Stripe.SubscriptionUpdateParams = {
         cancel_at_period_end: false,
      };
      expect(stripeMock.subscriptions.update).toHaveBeenCalledTimes(1);
      expect(stripeMock.subscriptions.update).toHaveBeenCalledWith(
         subscription.stripeSubscriptionId,
         expectedStripeUpdateParams
      );

      const expectedUpdateParams: DSubscriptionUpdate = {
         cancelAtPeriodEnd: false,
         canceledAt: null,
      };
      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledWith(
         userId,
         expectedUpdateParams
      );

      const expectedHistoryParams: DSubscriptionHistoryCreate = {
         userId,
         eventType: "reactivated",
         fromStatus: subscription.status,
         toStatus: subscription.status,
         metadata: {
            cancelAtPeriodEnd: false,
         },
      };
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledWith(expectedHistoryParams);
   });

   it("reactivateSubscription - throws error when no subscription found - test", async () => {
      const userId = "user-1";

      subscriptionServiceMock.getSubscription.mockResolvedValue(null);

      const fn = () => stripeService.reactivateSubscription(userId);

      await expect(fn).rejects.toThrow("No subscription found");

      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.subscriptions.update).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.updateSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });

   it("reactivateSubscription - throws error when no Stripe subscription ID - test", async () => {
      const userId = "user-1";
      const subscription = dtestData.dSubscription(1);
      subscription.stripeSubscriptionId = null;
      subscription.cancelAtPeriodEnd = true;

      subscriptionServiceMock.getSubscription.mockResolvedValue(subscription);

      const fn = () => stripeService.reactivateSubscription(userId);

      await expect(fn).rejects.toThrow("No Stripe subscription found");

      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.subscriptions.update).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.updateSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });

   it("reactivateSubscription - throws error when subscription is not set to cancel - test", async () => {
      const userId = "user-1";
      const subscription = dtestData.dSubscription(1);
      subscription.stripeSubscriptionId = "sub_test123";
      subscription.cancelAtPeriodEnd = false;

      subscriptionServiceMock.getSubscription.mockResolvedValue(subscription);

      const fn = () => stripeService.reactivateSubscription(userId);

      await expect(fn).rejects.toThrow("Subscription is not set to cancel");

      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.subscriptions.update).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.updateSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });
});

describe("handleSubscriptionCheckoutCompleted tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      getStripeMock.mockReturnValue(stripeMock);
   });

   it("handleSubscriptionCheckoutCompleted - successful handling - test", async () => {
      const userId = "user-123";
      const stripeSubscriptionId = "sub_test_123";
      const stripeCustomerId = "cus_test_123";
      const periodStart = 1609459200;
      const periodEnd = 1640995200;

      const session = stripeTestData.stripeCheckoutSession(1, {
         metadata: {
            userId,
         },
         subscription: stripeSubscriptionId,
      });

      const stripeSubscription = stripeTestData.stripeSubscriptionResponse(1, {
         id: stripeSubscriptionId,
         status: "active",
         customer: stripeCustomerId,
         items: {
            data: [
               {
                  current_period_start: periodStart,
                  current_period_end: periodEnd,
               },
            ],
         },
      });

      const subscription = dtestData.dSubscription();

      stripeMock.subscriptions.retrieve.mockResolvedValue(stripeSubscription);
      subscriptionServiceMock.getSubscription.mockResolvedValue(subscription);

      await stripeService.handleSubscriptionCheckoutCompleted(session);

      expect(stripeMock.subscriptions.retrieve).toHaveBeenCalledTimes(1);
      expect(stripeMock.subscriptions.retrieve).toHaveBeenCalledWith(
         stripeSubscriptionId
      );

      const expectedSubscriptionUpdate: DSubscriptionUpdate = {
         status: "ACTIVE",
         stripeSubscriptionId: stripeSubscriptionId,
         stripeCustomerId: stripeCustomerId,
         currentPeriodStart: new Date(periodStart * 1000),
         currentPeriodEnd: new Date(periodEnd * 1000),
      };
      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledWith(
         userId,
         expectedSubscriptionUpdate
      );

      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );

      const expectedHistoryCreate: DSubscriptionHistoryCreate = {
         userId,
         eventType: "activated",
         fromStatus: "INCOMPLETE",
         toStatus: "ACTIVE",
         toTier: subscription.plan.tier,
         stripeEventId: session.id,
      };
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledWith(expectedHistoryCreate);
   });

   it("handleSubscriptionCheckoutCompleted - handles trialing status - test", async () => {
      const userId = "user-123";
      const stripeCustomerId = "cus_test_123";
      const stripeSubscriptionId = "sub_test_123";
      const periodStart = 1609459200;
      const periodEnd = 1640995200;

      const session = stripeTestData.stripeCheckoutSession(1, {
         metadata: {
            userId,
         },
         subscription: stripeSubscriptionId,
      });

      const stripeSubscription = stripeTestData.stripeSubscriptionResponse(1, {
         id: stripeSubscriptionId,
         status: "trialing",
         customer: stripeCustomerId,
         items: {
            data: [
               {
                  current_period_start: periodStart,
                  current_period_end: periodEnd,
               },
            ],
         },
      });

      const subscription = dtestData.dSubscription();

      stripeMock.subscriptions.retrieve.mockResolvedValue(stripeSubscription);
      subscriptionServiceMock.getSubscription.mockResolvedValue(subscription);

      await stripeService.handleSubscriptionCheckoutCompleted(session);

      const expectedSubscriptionUpdate: DSubscriptionUpdate = {
         status: "TRIALING",
         stripeSubscriptionId: stripeSubscriptionId,
         stripeCustomerId: stripeCustomerId,
         currentPeriodStart: new Date(periodStart * 1000),
         currentPeriodEnd: new Date(periodEnd * 1000),
      };

      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledWith(
         userId,
         expectedSubscriptionUpdate
      );

      const expectedHistoryCreate: DSubscriptionHistoryCreate = {
         userId,
         eventType: "activated",
         fromStatus: "INCOMPLETE",
         toStatus: "TRIALING",
         toTier: subscription.plan.tier,
         stripeEventId: session.id,
      };
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledWith(expectedHistoryCreate);
   });

   it("handleSubscriptionCheckoutCompleted - throws error when userId is missing - test", async () => {
      const session: Stripe.Checkout.Session = {
         id: "session_123",
         metadata: {},
         subscription: "sub_test_123",
      } as Stripe.Checkout.Session;

      await expect(
         stripeService.handleSubscriptionCheckoutCompleted(session)
      ).rejects.toThrow("Missing userId or subscription in checkout session");

      expect(stripeMock.subscriptions.retrieve).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.updateSubscription).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.getSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });

   it("handleSubscriptionCheckoutCompleted - throws error when subscription is missing - test", async () => {
      const session = stripeTestData.stripeCheckoutSession(1, {
         metadata: {
            userId: "user-123",
         },
         subscription: null,
      });

      const fn = () =>
         stripeService.handleSubscriptionCheckoutCompleted(session);

      await expect(fn).rejects.toThrow(
         "Missing userId or subscription in checkout session"
      );

      expect(stripeMock.subscriptions.retrieve).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.updateSubscription).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.getSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });

   it("handleSubscriptionCheckoutCompleted - throws error when metadata is undefined - test", async () => {
      const session = stripeTestData.stripeCheckoutSession(1, {
         subscription: "sub_test_123",
      });

      const fn = () =>
         stripeService.handleSubscriptionCheckoutCompleted(session);

      await expect(fn).rejects.toThrow(
         "Missing userId or subscription in checkout session"
      );

      expect(stripeMock.subscriptions.retrieve).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.updateSubscription).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.getSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });
});

describe("handleSubscriptionUpdated tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
      getStripeMock.mockReturnValue(stripeMock);
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("handleSubscriptionUpdated - successful update with status changed - test", async () => {
      const userId = "user-123";
      const localSubscription = dtestData.dSubscription();
      localSubscription.userId = userId;
      localSubscription.status = "ACTIVE";
      const periodStart = 1609459200;
      const periodEnd = 1640995200;

      const stripeSubscription = stripeTestData.stripeSubscription(1, {
         id: "sub_test_123",
         status: "past_due",
         metadata: {
            userId,
         },
         cancel_at_period_end: false,
         items: {
            data: [
               {
                  current_period_start: periodStart,
                  current_period_end: periodEnd,
               },
            ],
         },
      });

      subscriptionServiceMock.getSubscription.mockResolvedValue(
         localSubscription
      );

      await stripeService.handleSubscriptionUpdated(stripeSubscription);

      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );
      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).not.toHaveBeenCalled();

      const expectedSubscriptionUpdate: DSubscriptionUpdate = {
         status: "PAST_DUE",
         currentPeriodStart: new Date(periodStart * 1000),
         currentPeriodEnd: new Date(periodEnd * 1000),
         cancelAtPeriodEnd: false,
      };
      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledWith(
         userId,
         expectedSubscriptionUpdate
      );

      const expectedHistoryCreate: DSubscriptionHistoryCreate = {
         userId,
         eventType: "updated",
         fromStatus: "ACTIVE",
         toStatus: "PAST_DUE",
         stripeEventId: stripeSubscription.id,
      };
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledWith(expectedHistoryCreate);
   });

   it("handleSubscriptionUpdated - successful update without status change - test", async () => {
      const userId = "user-123";
      const localSubscription = dtestData.dSubscription();
      localSubscription.userId = userId;
      localSubscription.status = "ACTIVE";
      const periodStart = 1609459200;
      const periodEnd = 1640995200;

      const stripeSubscription = stripeTestData.stripeSubscription(1, {
         id: "sub_test_123",
         status: "active",
         metadata: {
            userId,
         },
         cancel_at_period_end: true,
         items: {
            data: [
               {
                  current_period_start: periodStart,
                  current_period_end: periodEnd,
               },
            ],
         },
      });

      subscriptionServiceMock.getSubscription.mockResolvedValue(
         localSubscription
      );

      await stripeService.handleSubscriptionUpdated(stripeSubscription);

      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );

      const expectedSubscriptionUpdate: DSubscriptionUpdate = {
         status: "ACTIVE",
         currentPeriodStart: new Date(periodStart * 1000),
         currentPeriodEnd: new Date(periodEnd * 1000),
         cancelAtPeriodEnd: true,
      };
      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledWith(
         userId,
         expectedSubscriptionUpdate
      );

      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });

   it("handleSubscriptionUpdated - subscription not found with userId - test", async () => {
      const userId = "user-123";

      const stripeSubscription = stripeTestData.stripeSubscription(1, {
         id: "sub_test_123",
         status: "active",
         metadata: {
            userId,
         },
         cancel_at_period_end: false,
         items: {
            data: [
               {
                  current_period_start: 1672531200,
                  current_period_end: 1704067200,
               },
            ],
         },
      });

      subscriptionServiceMock.getSubscription.mockResolvedValue(null);

      await stripeService.handleSubscriptionUpdated(stripeSubscription);

      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );
      expect(console.error).toHaveBeenCalledWith("Subscription not found");
      expect(subscriptionServiceMock.updateSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });

   it("handleSubscriptionUpdated - subscription not found without userId - test", async () => {
      const stripeSubscription = stripeTestData.stripeSubscription(1, {
         id: "sub_test_123",
         status: "active",
         metadata: {},
         cancel_at_period_end: false,
         items: {
            data: [
               {
                  current_period_start: 1672531200,
                  current_period_end: 1704067200,
               },
            ],
         },
      });

      subscriptionServiceMock.getSubscriptionByStripeSubscriptionId.mockResolvedValue(
         null
      );

      await stripeService.handleSubscriptionUpdated(stripeSubscription);

      expect(subscriptionServiceMock.getSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).toHaveBeenCalledWith(stripeSubscription.id);
      expect(console.error).toHaveBeenCalledWith("Subscription not found");
      expect(subscriptionServiceMock.updateSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });
});

describe("handleSubscriptionDeleted tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
      getStripeMock.mockReturnValue(stripeMock);
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("handleSubscriptionDeleted - successful deletion - test", async () => {
      const userId = "user-123";
      const stripeSubscriptionId = "sub_test_123";
      const localSubscription = dtestData.dSubscription();
      localSubscription.userId = userId;
      localSubscription.stripeSubscriptionId = stripeSubscriptionId;
      localSubscription.status = "ACTIVE";

      const stripeSubscription = stripeTestData.stripeSubscription(1, {
         id: stripeSubscriptionId,
         status: "canceled",
         metadata: {
            userId,
         },
      });

      subscriptionServiceMock.getSubscriptionByStripeSubscriptionId.mockResolvedValue(
         localSubscription
      );

      await stripeService.handleSubscriptionDeleted(stripeSubscription);

      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).toHaveBeenCalledWith(stripeSubscriptionId);

      const expectedHistoryCreate: DSubscriptionHistoryCreate = {
         userId,
         eventType: "expired",
         fromStatus: localSubscription.status,
         fromTier: localSubscription.plan.tier,
         stripeEventId: stripeSubscriptionId,
      };
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledWith(expectedHistoryCreate);

      expect(subscriptionServiceMock.deleteSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.deleteSubscription).toHaveBeenCalledWith(
         userId
      );
   });

   it("handleSubscriptionDeleted - subscription not found - test", async () => {
      const stripeSubscriptionId = "sub_test_123";
      const stripeSubscription = stripeTestData.stripeSubscription(1, {
         id: stripeSubscriptionId,
         status: "canceled",
      });

      subscriptionServiceMock.getSubscriptionByStripeSubscriptionId.mockResolvedValue(
         null
      );

      await stripeService.handleSubscriptionDeleted(stripeSubscription);

      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).toHaveBeenCalledWith(stripeSubscriptionId);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
         "Subscription not found for deletion"
      );

      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.deleteSubscription).not.toHaveBeenCalled();
   });
});

describe("handleInvoicePaymentSucceeded tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
      getStripeMock.mockReturnValue(stripeMock);
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("handleInvoicePaymentSucceeded - successful payment processing - test", async () => {
      const userId = "user-123";
      const stripeSubscriptionId = "sub_test_123";
      const invoiceId = "in_test_123";
      const amountPaid = 9900;
      const periodStart = 1672531200;
      const periodEnd = 1704067200;

      const localSubscription = dtestData.dSubscription();
      localSubscription.userId = userId;
      localSubscription.stripeSubscriptionId = stripeSubscriptionId;

      const stripeInvoice = stripeTestData.stripeInvoice(1, {
         id: invoiceId,
         subscription: stripeSubscriptionId,
         amount_paid: amountPaid,
      });

      const stripeSubscription = stripeTestData.stripeSubscriptionResponse(1, {
         id: stripeSubscriptionId,
         status: "active",
         items: {
            data: [
               {
                  current_period_start: periodStart,
                  current_period_end: periodEnd,
               },
            ],
         },
      });

      subscriptionServiceMock.getSubscriptionByStripeSubscriptionId.mockResolvedValue(
         localSubscription
      );
      stripeMock.subscriptions.retrieve.mockResolvedValue(stripeSubscription);

      await stripeService.handleInvoicePaymentSucceeded(stripeInvoice);

      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).toHaveBeenCalledWith(stripeSubscriptionId);

      expect(stripeMock.subscriptions.retrieve).toHaveBeenCalledTimes(1);
      expect(stripeMock.subscriptions.retrieve).toHaveBeenCalledWith(
         stripeSubscriptionId
      );

      const expectedSubscriptionUpdate: DSubscriptionUpdate = {
         status: "ACTIVE",
         currentPeriodStart: new Date(periodStart * 1000),
         currentPeriodEnd: new Date(periodEnd * 1000),
      };
      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledWith(
         userId,
         expectedSubscriptionUpdate
      );

      const expectedHistoryCreate: DSubscriptionHistoryCreate = {
         userId,
         eventType: "renewed",
         toStatus: "ACTIVE",
         stripeEventId: invoiceId,
         metadata: {
            invoiceId: invoiceId,
            amountPaid: amountPaid / 100,
         },
      };
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledWith(expectedHistoryCreate);
   });

   it("handleInvoicePaymentSucceeded - invoice without subscription ID - test", async () => {
      const stripeInvoice = stripeTestData.stripeInvoice(1, {
         subscription: null,
         amount_paid: 9900,
      });

      await stripeService.handleInvoicePaymentSucceeded(stripeInvoice);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
         "Invoice doesn't have subscriptionId"
      );

      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).not.toHaveBeenCalled();
      expect(stripeMock.subscriptions.retrieve).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.updateSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });

   it("handleInvoicePaymentSucceeded - subscription not found - test", async () => {
      const stripeSubscriptionId = "sub_test_123";

      const stripeInvoice = stripeTestData.stripeInvoice(1, {
         subscription: stripeSubscriptionId,
         amount_paid: 9900,
      });

      subscriptionServiceMock.getSubscriptionByStripeSubscriptionId.mockResolvedValue(
         null
      );

      await stripeService.handleInvoicePaymentSucceeded(stripeInvoice);

      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).toHaveBeenCalledWith(stripeSubscriptionId);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
         "Subscription not found for invoice"
      );

      expect(stripeMock.subscriptions.retrieve).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.updateSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });
});

describe("handleInvoicePaymentFailed tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      jest.spyOn(console, "error").mockImplementation(() => {});
      getStripeMock.mockReturnValue(stripeMock);
   });

   afterEach(() => {
      jest.restoreAllMocks();
   });

   it("handleInvoicePaymentFailed - successful payment failure processing - test", async () => {
      const userId = "user-123";
      const stripeSubscriptionId = "sub_test_123";
      const invoiceId = "in_test_123";
      const attemptCount = 2;

      const localSubscription = dtestData.dSubscription();
      localSubscription.userId = userId;
      localSubscription.stripeSubscriptionId = stripeSubscriptionId;
      localSubscription.status = "ACTIVE";

      const stripeInvoice = stripeTestData.stripeInvoice(1, {
         id: invoiceId,
         subscription: stripeSubscriptionId,
         attempt_count: attemptCount,
      });

      subscriptionServiceMock.getSubscriptionByStripeSubscriptionId.mockResolvedValue(
         localSubscription
      );

      await stripeService.handleInvoicePaymentFailed(stripeInvoice);

      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).toHaveBeenCalledWith(stripeSubscriptionId);

      const expectedSubscriptionUpdate: DSubscriptionUpdate = {
         status: "PAST_DUE",
      };
      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.updateSubscription).toHaveBeenCalledWith(
         userId,
         expectedSubscriptionUpdate
      );

      const expectedHistoryCreate: DSubscriptionHistoryCreate = {
         userId,
         eventType: "payment_failed",
         fromStatus: localSubscription.status,
         toStatus: "PAST_DUE",
         stripeEventId: invoiceId,
         metadata: {
            invoiceId: invoiceId,
            attemptCount: attemptCount,
         },
      };
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).toHaveBeenCalledWith(expectedHistoryCreate);
   });

   it("handleInvoicePaymentFailed - invoice without subscription ID - test", async () => {
      const stripeInvoice = stripeTestData.stripeInvoice(1, {
         subscription: null,
         attempt_count: 1,
      });

      await stripeService.handleInvoicePaymentFailed(stripeInvoice);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
         "Invoice doesn't have subscriptionId"
      );

      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).not.toHaveBeenCalled();
      expect(subscriptionServiceMock.updateSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });

   it("handleInvoicePaymentFailed - subscription not found - test", async () => {
      const stripeSubscriptionId = "sub_test_123";

      const stripeInvoice = stripeTestData.stripeInvoice(1, {
         subscription: stripeSubscriptionId,
         attempt_count: 1,
      });

      subscriptionServiceMock.getSubscriptionByStripeSubscriptionId.mockResolvedValue(
         null
      );

      await stripeService.handleInvoicePaymentFailed(stripeInvoice);

      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.getSubscriptionByStripeSubscriptionId
      ).toHaveBeenCalledWith(stripeSubscriptionId);

      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
         "Subscription not found for failed invoice"
      );

      expect(subscriptionServiceMock.updateSubscription).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createSubscriptionHistory
      ).not.toHaveBeenCalled();
   });
});

describe("createPortalSession tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      getStripeMock.mockReturnValue(stripeMock);
   });

   it("createPortalSession - successful portal session creation - test", async () => {
      const userId = "user-1";
      const subscription = dtestData.dSubscription(1);
      subscription.stripeCustomerId = "cus_test123";
      const billingPortalSession = stripeTestData.billingPortalSession();

      subscriptionServiceMock.getSubscription.mockResolvedValue(subscription);
      stripeMock.billingPortal.sessions.create.mockResolvedValue(
         billingPortalSession
      );

      const result = await stripeService.createPortalSession(userId);

      const expectedResult: DStripeBillingPortalSessionResponse = {
         url: billingPortalSession.url,
      };

      expect(result).toEqual(expectedResult);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );

      const expectedParams: Stripe.BillingPortal.SessionCreateParams = {
         customer: subscription.stripeCustomerId,
         return_url: "http://localhost:3000/settings/subscription",
      };
      expect(stripeMock.billingPortal.sessions.create).toHaveBeenCalledTimes(1);
      expect(stripeMock.billingPortal.sessions.create).toHaveBeenCalledWith(
         expectedParams
      );
   });

   it("createPortalSession - throws error when no subscription found - test", async () => {
      const userId = "user-1";

      subscriptionServiceMock.getSubscription.mockResolvedValue(null);

      const fn = () => stripeService.createPortalSession(userId);

      await expect(fn).rejects.toThrow("No active subscription found");

      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.billingPortal.sessions.create).not.toHaveBeenCalled();
   });

   it("createPortalSession - throws error when subscription has no stripe customer ID - test", async () => {
      const userId = "user-1";
      const subscription = dtestData.dSubscription(1);
      subscription.stripeCustomerId = null;

      subscriptionServiceMock.getSubscription.mockResolvedValue(subscription);

      const fn = () => stripeService.createPortalSession(userId);

      await expect(fn).rejects.toThrow("No active subscription found");

      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.billingPortal.sessions.create).not.toHaveBeenCalled();
   });

   it("createPortalSession - throws error when subscription has undefined stripe customer ID - test", async () => {
      const userId = "user-1";
      const subscription = dtestData.dSubscription(1);
      subscription.stripeCustomerId = null;

      subscriptionServiceMock.getSubscription.mockResolvedValue(subscription);

      const fn = () => stripeService.createPortalSession(userId);

      await expect(fn).rejects.toThrow("No active subscription found");

      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.billingPortal.sessions.create).not.toHaveBeenCalled();
   });

   it("createPortalSession - throws error when subscription has empty string stripe customer ID - test", async () => {
      const userId = "user-1";
      const subscription = dtestData.dSubscription(1);
      subscription.stripeCustomerId = "";

      subscriptionServiceMock.getSubscription.mockResolvedValue(subscription);

      const fn = () => stripeService.createPortalSession(userId);

      await expect(fn).rejects.toThrow("No active subscription found");

      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getSubscription).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.billingPortal.sessions.create).not.toHaveBeenCalled();
   });
});

describe("getOrCreateStripeCustomer tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
      getStripeMock.mockReturnValue(stripeMock);
   });

   it("getOrCreateStripeCustomer - returns existing customer ID - test", async () => {
      const userId = "user-1";
      const email = "test@email.com";
      const existingCustomerId = "cus_existing123";

      userServiceMock.getUserStripeCustomerId.mockResolvedValue(
         existingCustomerId
      );

      const result = await stripeService.getOrCreateStripeCustomer(
         userId,
         email
      );

      expect(result).toBe(existingCustomerId);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.customers.create).not.toHaveBeenCalled();
      expect(userServiceMock.updateUserStripeCustomerId).not.toHaveBeenCalled();
   });

   it("getOrCreateStripeCustomer - creates new customer when none exists - test", async () => {
      const userId = "user-1";
      const email = "test@email.com";
      const stripeCustomer = stripeTestData.stripeCustomer();

      userServiceMock.getUserStripeCustomerId.mockResolvedValue(null);
      stripeMock.customers.create.mockResolvedValue(stripeCustomer);

      const result = await stripeService.getOrCreateStripeCustomer(
         userId,
         email
      );

      const expectedCustomerData: Stripe.CustomerCreateParams = {
         email,
         metadata: {
            userId,
         },
      };

      expect(result).toBe(stripeCustomer.id);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.customers.create).toHaveBeenCalledTimes(1);
      expect(stripeMock.customers.create).toHaveBeenCalledWith(
         expectedCustomerData
      );
      expect(userServiceMock.updateUserStripeCustomerId).toHaveBeenCalledTimes(
         1
      );
      expect(userServiceMock.updateUserStripeCustomerId).toHaveBeenCalledWith(
         userId,
         stripeCustomer.id
      );
   });

   it("getOrCreateStripeCustomer - creates new customer when customer ID is empty string - test", async () => {
      const userId = "user-1";
      const email = "test@email.com";
      const stripeCustomer = stripeTestData.stripeCustomer();

      userServiceMock.getUserStripeCustomerId.mockResolvedValue("");
      stripeMock.customers.create.mockResolvedValue(stripeCustomer);

      const result = await stripeService.getOrCreateStripeCustomer(
         userId,
         email
      );

      const expectedCustomerData: Stripe.CustomerCreateParams = {
         email,
         metadata: {
            userId,
         },
      };

      expect(result).toBe(stripeCustomer.id);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.customers.create).toHaveBeenCalledTimes(1);
      expect(stripeMock.customers.create).toHaveBeenCalledWith(
         expectedCustomerData
      );
      expect(userServiceMock.updateUserStripeCustomerId).toHaveBeenCalledTimes(
         1
      );
      expect(userServiceMock.updateUserStripeCustomerId).toHaveBeenCalledWith(
         userId,
         stripeCustomer.id
      );
   });
});
