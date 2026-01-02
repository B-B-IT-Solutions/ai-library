jest.mock("@/data/services/cart");
jest.mock("@/data/services/order");
jest.mock("@/lib/stripe/stripe-server");
jest.mock("@/data/actions/auth-utils");

import { dtestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import Stripe from "stripe";

import { requireUser } from "@/data/actions/auth-utils";
import prisma from "@/data/db/prisma";
import { CartService, ServiceFactory } from "@/data/services";
import { OrderService } from "@/data/services/order";
import { DOrderUpdate } from "@/data/types/domain/order";
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

const cartServiceMock = cartService as DeepMockProxy<CartService>;
const orderServiceMock = orderService as DeepMockProxy<OrderService>;

const stripeService = new StripeService(cartServiceMock, orderServiceMock);

const stripeCheckoutSession = (): Stripe.Response<Stripe.Checkout.Session> => {
   return {
      id: "session-1",
      url: "https://checkout.stripe.com/session-1",
   } as unknown as Stripe.Response<Stripe.Checkout.Session>;
};

describe("createCheckoutSession tests", () => {
   beforeEach(() => {
      jest.resetAllMocks();
   });

   it("createCheckoutSession - user not authenticated - test", async () => {
      const error = new Error("Authentication required");
      requireUserMock.mockRejectedValue(error);

      await expect(stripeService.createCheckoutSession()).rejects.toThrow(
         "Authentication required"
      );
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).not.toHaveBeenCalled();
      expect(sCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(sUpdateOrderMock).not.toHaveBeenCalled();
   });

   it("createCheckoutSession - cart empty - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const cart = dtestData.dCart(1, 0);

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);

      await expect(stripeService.createCheckoutSession()).rejects.toThrow(
         "Your cart is empty."
      );

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(sUpdateOrderMock).not.toHaveBeenCalled();
   });

   it("createCheckoutSession - successful checkout with single item - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = dtestData.dCart(1, 1);

      const order = dtestData.dOrder();
      const checkoutSession = stripeCheckoutSession();

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);
      sCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result = await stripeService.createCheckoutSession();

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

   it("createCheckoutSession - successful checkout with multiple items - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const cart = dtestData.dCart(1, 2);
      const order = dtestData.dOrder();
      const item1 = cart.items[0];
      const item2 = cart.items[1];
      item2.productDescription = undefined;

      const checkoutSession = stripeCheckoutSession();

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);
      sCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result = await stripeService.createCheckoutSession();

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

   it("createCheckoutSession - getCart throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const error = new Error("Database error");

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockRejectedValue(error);

      await expect(stripeService.createCheckoutSession()).rejects.toThrow(
         "Database error"
      );

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(sUpdateOrderMock).not.toHaveBeenCalled();
   });

   it("createCheckoutSession - pCreateOrder throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = dtestData.dCart(1, 1);
      const error = new Error("Failed to create order");

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);
      sCreateOrderMock.mockRejectedValue(error);

      await expect(stripeService.createCheckoutSession()).rejects.toThrow(
         "Failed to create order"
      );

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledWith(user.id, cart);
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(sUpdateOrderMock).not.toHaveBeenCalled();
   });

   it("createCheckoutSession - stripe.checkout.sessions.create throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = dtestData.dCart(1, 1);
      const order = dtestData.dOrder(1);
      const error = new Error("Stripe API error");

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);
      sCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockRejectedValue(error);

      await expect(stripeService.createCheckoutSession()).rejects.toThrow(
         "Stripe API error"
      );

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledWith(user.id, cart);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(sUpdateOrderMock).not.toHaveBeenCalled();
   });

   it("createCheckoutSession - pUpdateOrder throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = dtestData.dCart(1, 1);
      const order = dtestData.dOrder(1);
      const checkoutSession = stripeCheckoutSession();
      const error = new Error("Failed to update order");

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);
      sCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);
      sUpdateOrderMock.mockRejectedValue(error);

      await expect(stripeService.createCheckoutSession()).rejects.toThrow(
         "Failed to update order"
      );

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(cartServiceMock.getCart).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(sCreateOrderMock).toHaveBeenCalledWith(user.id, cart);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(sUpdateOrderMock).toHaveBeenCalledTimes(1);
   });

   it("createCheckoutSession - user with no email - test", async () => {
      const user = dtestData.dLoginUser();
      user.email = null;
      const cart = dtestData.dCart(1, 1);
      const order = dtestData.dOrder(1);
      const checkoutSession = stripeCheckoutSession();

      requireUserMock.mockResolvedValue(user);
      cartServiceMock.getCart.mockResolvedValue(cart);
      sCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);

      const result = await stripeService.createCheckoutSession();
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
