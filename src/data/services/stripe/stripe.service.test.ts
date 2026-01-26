jest.mock("@/data/services/cart");
jest.mock("@/data/services/order");
jest.mock("@/data/services/subscription");
jest.mock("@/data/services/user");
jest.mock("@/lib/stripe/stripe-server");
jest.mock("@/data/actions/auth-utils");

import { dtestData, stripeTestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import Stripe from "stripe";

import { requireUser } from "@/data/actions/auth-utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { CartService } from "@/data/services/cart";
import { OrderService } from "@/data/services/order";
import { SubscriptionService } from "@/data/services/subscription";
import { UserService } from "@/data/services/user";
import { DOrderUpdate } from "@/data/types/domain/order";
import { DStripeCheckoutResponse } from "@/data/types/domain/stripe";
import {
   DCreateSubscriptionCheckout,
   DSubscriptionUpdate,
} from "@/data/types/domain/subscription";
import { stripe } from "@/lib/stripe/stripe-server";

import { StripeService } from "./stripe.service";

const sCreateOrder = OrderService.prototype.createOrder;
const sUpdateOrder = OrderService.prototype.updateOrder;

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;
const sCreateOrderMock = sCreateOrder as jest.MockedFunction<
   typeof sCreateOrder
>;
const sUpdateOrderMock = sUpdateOrder as jest.MockedFunction<
   typeof sUpdateOrder
>;

const stripeMock = stripe as unknown as DeepMockProxy<Stripe>;

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
      const checkoutSession = stripeTestData.stripeCheckoutSession();

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);
      sCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result = await stripeService.createOrderCheckoutSession();

      const expectedResult = {
         sessionId: "session-1",
         url: "https://checkout.stripe.com/session-1",
      };

      const item1 = cart.items[0];

      const expectedStripeCheckoutPayload = {
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
         stripeCheckoutSessionId: "session-1",
         stripePaymentStatus: "unpaid",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledWith(user.id, cart);

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

      const checkoutSession = stripeTestData.stripeCheckoutSession();

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);
      sCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result = await stripeService.createOrderCheckoutSession();

      const expectedResult = {
         sessionId: "session-1",
         url: "https://checkout.stripe.com/session-1",
      };

      const expectedStripeCheckoutPayload = {
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
         stripeCheckoutSessionId: "session-1",
         stripePaymentStatus: "unpaid",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledWith(user.id, cart);

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

   it("createOrderCheckoutSession - getCart throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const error = new Error("Database error");

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockRejectedValue(error);

      await expect(stripeService.createOrderCheckoutSession()).rejects.toThrow(
         "Database error"
      );

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(sUpdateOrderMock).not.toHaveBeenCalled();
   });

   it("createOrderCheckoutSession - pCreateOrder throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = dtestData.dCart(1, 1);
      const error = new Error("Failed to create order");

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);
      sCreateOrderMock.mockRejectedValue(error);

      await expect(stripeService.createOrderCheckoutSession()).rejects.toThrow(
         "Failed to create order"
      );

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledWith(user.id, cart);
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(sUpdateOrderMock).not.toHaveBeenCalled();
   });

   it("createOrderCheckoutSession - stripe.checkout.sessions.create throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = dtestData.dCart(1, 1);
      const order = dtestData.dOrder(1);
      const error = new Error("Stripe API error");

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);
      sCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockRejectedValue(error);

      await expect(stripeService.createOrderCheckoutSession()).rejects.toThrow(
         "Stripe API error"
      );

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledWith(user.id, cart);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(sUpdateOrderMock).not.toHaveBeenCalled();
   });

   it("createOrderCheckoutSession - pUpdateOrder throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = dtestData.dCart(1, 1);
      const order = dtestData.dOrder(1);
      const checkoutSession = stripeTestData.stripeCheckoutSession();
      const error = new Error("Failed to update order");

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);
      sCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);
      sUpdateOrderMock.mockRejectedValue(error);

      await expect(stripeService.createOrderCheckoutSession()).rejects.toThrow(
         "Failed to update order"
      );

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledWith(user.id, cart);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(sUpdateOrderMock).toHaveBeenCalledTimes(1);
   });

   it("createOrderCheckoutSession - user with no email - test", async () => {
      const user = dtestData.dLoginUser();
      user.email = null;
      const cart = dtestData.dCart(1, 1);
      const order = dtestData.dOrder(1);
      const checkoutSession = stripeTestData.stripeCheckoutSession();

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);
      sCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result = await stripeService.createOrderCheckoutSession();
      const expectedResult = {
         sessionId: "session-1",
         url: "https://checkout.stripe.com/session-1",
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
   });

   it("createSubscriptionCheckoutSession - successful checkout with monthly billing - test", async () => {
      const plan = dtestData.dSubscriptionPlan(1);
      const stripeCustomer = stripeTestData.stripeCustomer();
      const checkoutSession = stripeTestData.stripeCheckoutSession();
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
      subscriptionServiceMock.getUserSubscription.mockResolvedValue(null);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result =
         await stripeService.createSubscriptionCheckoutSession(params);

      const expectedResult: DStripeCheckoutResponse = {
         sessionId: "session-1",
         url: "https://checkout.stripe.com/session-1",
      };

      expect(result).toEqual(expectedResult);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledWith(plan.id);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledWith(
         params.userId
      );
      expect(subscriptionServiceMock.getUserSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.getUserSubscription).toHaveBeenCalledWith(
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

      const expectedSubscriptionData: DSubscriptionUpdate = {
         userId: params.userId,
         planId: params.planId,
         billingInterval: params.billingInterval,
         tier: plan.tier,
         stripeCheckoutSessionId: checkoutSession.id,
         stripeCustomerId: stripeCustomer.id,
      };
      expect(
         subscriptionServiceMock.createUserSubscription
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.createUserSubscription
      ).toHaveBeenCalledWith(expectedSubscriptionData);
   });

   it("createSubscriptionCheckoutSession - successful checkout with yearly billing - test", async () => {
      const plan = dtestData.dSubscriptionPlan(1);
      const stripeCustomer = stripeTestData.stripeCustomer();
      const checkoutSession = stripeTestData.stripeCheckoutSession();
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
      subscriptionServiceMock.getUserSubscription.mockResolvedValue(null);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result =
         await stripeService.createSubscriptionCheckoutSession(params);

      const expectedResult: DStripeCheckoutResponse = {
         sessionId: "session-1",
         url: "https://checkout.stripe.com/session-1",
      };

      expect(result).toEqual(expectedResult);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledWith(plan.id);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledWith(
         params.userId
      );
      expect(subscriptionServiceMock.getUserSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.getUserSubscription).toHaveBeenCalledWith(
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

      const expectedSubscriptionData: DSubscriptionUpdate = {
         userId: params.userId,
         planId: params.planId,
         billingInterval: params.billingInterval,
         tier: plan.tier,
         stripeCheckoutSessionId: checkoutSession.id,
         stripeCustomerId: stripeCustomer.id,
      };
      expect(
         subscriptionServiceMock.createUserSubscription
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.createUserSubscription
      ).toHaveBeenCalledWith(expectedSubscriptionData);
   });

   it("createSubscriptionCheckoutSession - creates new Stripe customer if none exists - test", async () => {
      const plan = dtestData.dSubscriptionPlan(1);
      const stripeCustomer = stripeTestData.stripeCustomer();
      const checkoutSession = stripeTestData.stripeCheckoutSession();
      const params: DCreateSubscriptionCheckout = {
         userId: "user-1",
         userEmail: "test@email.com",
         planId: plan.id,
         billingInterval: "MONTHLY",
      };

      subscriptionServiceMock.getPlanById.mockResolvedValue(plan);
      userServiceMock.getUserStripeCustomerId.mockResolvedValue(null);
      stripeMock.customers.create.mockResolvedValue(stripeCustomer);
      subscriptionServiceMock.getUserSubscription.mockResolvedValue(null);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result =
         await stripeService.createSubscriptionCheckoutSession(params);

      const expectedResult: DStripeCheckoutResponse = {
         sessionId: "session-1",
         url: "https://checkout.stripe.com/session-1",
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
      const checkoutSession = stripeTestData.stripeCheckoutSession();
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
      subscriptionServiceMock.getUserSubscription.mockResolvedValue(
         existingSubscription
      );
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result =
         await stripeService.createSubscriptionCheckoutSession(params);

      const expectedResult: DStripeCheckoutResponse = {
         sessionId: "session-1",
         url: "https://checkout.stripe.com/session-1",
      };
      expect(result).toEqual(expectedResult);

      expect(
         subscriptionServiceMock.deleteUserSubscription
      ).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.deleteUserSubscription
      ).toHaveBeenCalledWith(params.userId);
   });

   it("createSubscriptionCheckoutSession - does not delete existing active subscription - test", async () => {
      const plan = dtestData.dSubscriptionPlan(1);
      const stripeCustomer = stripeTestData.stripeCustomer();
      const checkoutSession = stripeTestData.stripeCheckoutSession();
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
      subscriptionServiceMock.getUserSubscription.mockResolvedValue(
         existingSubscription
      );
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result =
         await stripeService.createSubscriptionCheckoutSession(params);

      const expectedResult: DStripeCheckoutResponse = {
         sessionId: "session-1",
         url: "https://checkout.stripe.com/session-1",
      };

      expect(result).toEqual(expectedResult);

      expect(
         subscriptionServiceMock.deleteUserSubscription
      ).not.toHaveBeenCalled();
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

      await expect(
         stripeService.createSubscriptionCheckoutSession(params)
      ).rejects.toThrow("No Stripe price configured for MONTHLY billing");

      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledWith(plan.id);
      expect(userServiceMock.getUserStripeCustomerId).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.getUserSubscription
      ).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createUserSubscription
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

      await expect(
         stripeService.createSubscriptionCheckoutSession(params)
      ).rejects.toThrow("No Stripe price configured for YEARLY billing");

      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledWith(plan.id);
      expect(userServiceMock.getUserStripeCustomerId).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.getUserSubscription
      ).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createUserSubscription
      ).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
   });

   it("createSubscriptionCheckoutSession - getPlanById throws error - test", async () => {
      const error = new Error("Plan not found");
      const params: DCreateSubscriptionCheckout = {
         userId: "user-1",
         userEmail: "test@email.com",
         planId: "plan-1",
         billingInterval: "MONTHLY" as const,
      };

      subscriptionServiceMock.getPlanById.mockRejectedValue(error);

      await expect(
         stripeService.createSubscriptionCheckoutSession(params)
      ).rejects.toThrow("Plan not found");

      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledWith(
         params.planId
      );
      expect(userServiceMock.getUserStripeCustomerId).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.getUserSubscription
      ).not.toHaveBeenCalled();
      expect(
         subscriptionServiceMock.createUserSubscription
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
      subscriptionServiceMock.getUserSubscription.mockResolvedValue(null);
      stripeMock.checkout.sessions.create.mockRejectedValue(error);

      await expect(
         stripeService.createSubscriptionCheckoutSession(params)
      ).rejects.toThrow("Stripe API error");

      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledWith(plan.id);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledWith(
         params.userId
      );
      expect(subscriptionServiceMock.getUserSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.getUserSubscription).toHaveBeenCalledWith(
         params.userId
      );

      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(
         subscriptionServiceMock.createUserSubscription
      ).not.toHaveBeenCalled();
   });

   it("createSubscriptionCheckoutSession - createUserSubscription throws error - test", async () => {
      const plan = dtestData.dSubscriptionPlan(1);
      const stripeCustomerId = "cus_test123";
      const checkoutSession = stripeTestData.stripeCheckoutSession();
      const error = new Error("Failed to create subscription");
      const params: DCreateSubscriptionCheckout = {
         userId: "user-1",
         userEmail: "test@email.com",
         planId: plan.id,
         billingInterval: "MONTHLY" as const,
      };

      subscriptionServiceMock.getPlanById.mockResolvedValue(plan);
      userServiceMock.getUserStripeCustomerId.mockResolvedValue(
         stripeCustomerId
      );
      subscriptionServiceMock.getUserSubscription.mockResolvedValue(null);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);
      subscriptionServiceMock.createUserSubscription.mockRejectedValue(error);

      await expect(
         stripeService.createSubscriptionCheckoutSession(params)
      ).rejects.toThrow("Failed to create subscription");

      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledTimes(1);
      expect(subscriptionServiceMock.getPlanById).toHaveBeenCalledWith(plan.id);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledTimes(1);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledWith(
         params.userId
      );
      expect(subscriptionServiceMock.getUserSubscription).toHaveBeenCalledTimes(
         1
      );
      expect(subscriptionServiceMock.getUserSubscription).toHaveBeenCalledWith(
         params.userId
      );
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);

      expect(
         subscriptionServiceMock.createUserSubscription
      ).toHaveBeenCalledTimes(1);
   });
});

describe("getOrCreateStripeCustomer tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
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
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.customers.create).not.toHaveBeenCalled();
      expect(userServiceMock.updateUserStripeCustomerId).not.toHaveBeenCalled();
   });

   it("getOrCreateStripeCustomer - creates new customer when none exists - test", async () => {
      const userId = "user-1";
      const email = "test@email.com";
      const newCustomerId = "cus_new123";

      userServiceMock.getUserStripeCustomerId.mockResolvedValue(null);
      stripeMock.customers.create.mockResolvedValue({
         id: newCustomerId,
      } as Stripe.Response<Stripe.Customer>);

      const result = await stripeService.getOrCreateStripeCustomer(
         userId,
         email
      );

      expect(result).toBe(newCustomerId);
      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.customers.create).toHaveBeenCalledWith({
         email,
         metadata: {
            userId,
         },
      });
      expect(userServiceMock.updateUserStripeCustomerId).toHaveBeenCalledWith(
         userId,
         newCustomerId
      );
   });

   it("getOrCreateStripeCustomer - creates new customer when customer ID is empty string - test", async () => {
      const userId = "user-1";
      const email = "test@email.com";
      const newCustomerId = "cus_new123";

      userServiceMock.getUserStripeCustomerId.mockResolvedValue("");
      stripeMock.customers.create.mockResolvedValue({
         id: newCustomerId,
      } as Stripe.Response<Stripe.Customer>);

      const result = await stripeService.getOrCreateStripeCustomer(
         userId,
         email
      );

      expect(result).toBe(newCustomerId);
      expect(stripeMock.customers.create).toHaveBeenCalledWith({
         email,
         metadata: {
            userId,
         },
      });
      expect(userServiceMock.updateUserStripeCustomerId).toHaveBeenCalledWith(
         userId,
         newCustomerId
      );
   });

   it("getOrCreateStripeCustomer - getUserStripeCustomerId throws error - test", async () => {
      const userId = "user-1";
      const email = "test@email.com";
      const error = new Error("Database error");

      userServiceMock.getUserStripeCustomerId.mockRejectedValue(error);

      await expect(
         stripeService.getOrCreateStripeCustomer(userId, email)
      ).rejects.toThrow("Database error");

      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.customers.create).not.toHaveBeenCalled();
      expect(userServiceMock.updateUserStripeCustomerId).not.toHaveBeenCalled();
   });

   it("getOrCreateStripeCustomer - stripe.customers.create throws error - test", async () => {
      const userId = "user-1";
      const email = "test@email.com";
      const error = new Error("Stripe API error");

      userServiceMock.getUserStripeCustomerId.mockResolvedValue(null);
      stripeMock.customers.create.mockRejectedValue(error);

      await expect(
         stripeService.getOrCreateStripeCustomer(userId, email)
      ).rejects.toThrow("Stripe API error");

      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.customers.create).toHaveBeenCalledWith({
         email,
         metadata: {
            userId,
         },
      });
      expect(userServiceMock.updateUserStripeCustomerId).not.toHaveBeenCalled();
   });

   it("getOrCreateStripeCustomer - updateUserStripeCustomerId throws error - test", async () => {
      const userId = "user-1";
      const email = "test@email.com";
      const newCustomerId = "cus_new123";
      const error = new Error("Failed to update user");

      userServiceMock.getUserStripeCustomerId.mockResolvedValue(null);
      stripeMock.customers.create.mockResolvedValue({
         id: newCustomerId,
      } as Stripe.Response<Stripe.Customer>);
      userServiceMock.updateUserStripeCustomerId.mockRejectedValue(error);

      await expect(
         stripeService.getOrCreateStripeCustomer(userId, email)
      ).rejects.toThrow("Failed to update user");

      expect(userServiceMock.getUserStripeCustomerId).toHaveBeenCalledWith(
         userId
      );
      expect(stripeMock.customers.create).toHaveBeenCalledWith({
         email,
         metadata: {
            userId,
         },
      });
      expect(userServiceMock.updateUserStripeCustomerId).toHaveBeenCalledWith(
         userId,
         newCustomerId
      );
   });
});
