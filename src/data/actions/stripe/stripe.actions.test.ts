jest.mock("@/data/actions/cart");
jest.mock("@/data/db/queries/order");
jest.mock("@/lib/stripe/stripe-server");
jest.mock("@/data/actions/auth-utils");
jest.mock("@/data/actions/utils");

import { dtestData, ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
import Stripe from "stripe";

import { requireUser } from "@/data/actions/auth-utils";
import { getCart } from "@/data/actions/cart";
import { formatError } from "@/data/actions/utils";
import {
   pCreateOrder,
   pUpdateOrderWithStripeDetails,
} from "@/data/db/queries/order";
import { stripe } from "@/lib/stripe/stripe-server";

import { createCheckoutSession } from "./stripe.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;
const getCartMock = getCart as jest.MockedFunction<typeof getCart>;
const pCreateOrderMock = pCreateOrder as jest.MockedFunction<
   typeof pCreateOrder
>;
const pUpdateOrderWithStripeDetailsMock =
   pUpdateOrderWithStripeDetails as jest.MockedFunction<
      typeof pUpdateOrderWithStripeDetails
   >;

const formatErrorMock = formatError as jest.MockedFunction<typeof formatError>;

export const stripeMock = stripe as unknown as DeepMockProxy<Stripe>;

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
      formatErrorMock.mockReturnValue("Authentication required");

      const result = await createCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Authentication required",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(getCartMock).not.toHaveBeenCalled();
      expect(pCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
      expect(formatErrorMock).toHaveBeenCalledTimes(1);
      expect(formatErrorMock).toHaveBeenCalledWith(error);
   });

   it("createCheckoutSession - cart empty - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const cart = dtestData.dCart(1, 0);

      requireUserMock.mockResolvedValue(user);
      getCartMock.mockResolvedValue(cart);

      const result = await createCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Your cart is empty.",
      };

      expect(result).toEqual(expectedResult);

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(getCartMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
   });

   it("createCheckoutSession - successful checkout with single item - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = dtestData.dCart(1, 1);
      const totalAmount = 19.99;

      const order = ptestData.pOrderWithItems();
      const checkoutSession = stripeCheckoutSession();

      requireUserMock.mockResolvedValue(user);
      getCartMock.mockResolvedValue(cart);
      pCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);
      pUpdateOrderWithStripeDetailsMock.mockResolvedValue(order);

      const result = await createCheckoutSession();

      const expectedResult = {
         success: true,
         message: "Checkout session created",
         data: {
            sessionId: "session-1",
            url: "https://checkout.stripe.com/session-1",
         },
      };

      const item1 = cart.items[0];
      const expectOrderCreateInput = {
         user: {
            connect: {
               id: user.id,
            },
         },
         status: "PENDING",
         totalAmount,
         items: {
            create: [
               {
                  product: {
                     connect: {
                        id: item1.productId,
                     },
                  },
                  quantity: 1,
                  price: Number(item1.productPrice),
               },
            ],
         },
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

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(getCartMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).toHaveBeenCalledWith(expectOrderCreateInput);

      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
         expectedStripeCheckoutPayload
      );

      expect(pUpdateOrderWithStripeDetailsMock).toHaveBeenCalledTimes(1);
      expect(pUpdateOrderWithStripeDetailsMock).toHaveBeenCalledWith(order.id, {
         stripeCheckoutSessionId: "session-1",
         stripePaymentStatus: "unpaid",
      });
   });

   it("createCheckoutSession - successful checkout with multiple items - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const cart = dtestData.dCart(1, 2);
      const order = ptestData.pOrderWithItems();
      const totalAmount = 19.99 + 19.99;
      const item1 = cart.items[0];
      const item2 = cart.items[1];
      item2.productDescription = undefined;

      const checkoutSession = stripeCheckoutSession();

      requireUserMock.mockResolvedValue(user);
      getCartMock.mockResolvedValue(cart);
      pCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);
      pUpdateOrderWithStripeDetailsMock.mockResolvedValue(order);

      const result = await createCheckoutSession();

      const expectedResult = {
         success: true,
         message: "Checkout session created",
         data: {
            sessionId: "session-1",
            url: "https://checkout.stripe.com/session-1",
         },
      };

      const expectOrderCreateInput = {
         user: {
            connect: {
               id: user.id,
            },
         },
         status: "PENDING",
         totalAmount,
         items: {
            create: [
               {
                  product: {
                     connect: {
                        id: item1.productId,
                     },
                  },
                  quantity: 1,
                  price: 19.99,
               },
               {
                  product: {
                     connect: {
                        id: item2.productId,
                     },
                  },
                  quantity: 1,
                  price: 19.99,
               },
            ],
         },
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

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(getCartMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).toHaveBeenCalledWith(expectOrderCreateInput);

      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
         expectedStripeCheckoutPayload
      );

      expect(pUpdateOrderWithStripeDetailsMock).toHaveBeenCalledTimes(1);
      expect(pUpdateOrderWithStripeDetailsMock).toHaveBeenCalledWith(order.id, {
         stripeCheckoutSessionId: "session-1",
         stripePaymentStatus: "unpaid",
      });
   });

   it("createCheckoutSession - getCartMock throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const error = new Error("Database error");

      requireUserMock.mockResolvedValue(user);
      getCartMock.mockRejectedValue(error);
      formatErrorMock.mockReturnValue("Database error");

      const result = await createCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Database error",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(getCartMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
      expect(formatErrorMock).toHaveBeenCalledTimes(1);
      expect(formatErrorMock).toHaveBeenCalledWith(error);
   });

   it("createCheckoutSession - pCreateOrder throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = dtestData.dCart(1, 1);
      const error = new Error("Failed to create order");

      requireUserMock.mockResolvedValue(user);
      getCartMock.mockResolvedValue(cart);
      pCreateOrderMock.mockRejectedValue(error);
      formatErrorMock.mockReturnValue("Failed to create order");

      const result = await createCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Failed to create order",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(getCartMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
      expect(formatErrorMock).toHaveBeenCalledTimes(1);
      expect(formatErrorMock).toHaveBeenCalledWith(error);
   });

   it("createCheckoutSession - stripe.checkout.sessions.create throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = dtestData.dCart(1, 1);
      const order = ptestData.pOrderWithItems(1);
      const error = new Error("Stripe API error");

      requireUserMock.mockResolvedValue(user);
      getCartMock.mockResolvedValue(cart);
      pCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockRejectedValue(error);
      formatErrorMock.mockReturnValue("Stripe API error");

      const result = await createCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Stripe API error",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(getCartMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
      expect(formatErrorMock).toHaveBeenCalledTimes(1);
      expect(formatErrorMock).toHaveBeenCalledWith(error);
   });

   it("createCheckoutSession - pUpdateOrderWithStripeDetails throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = dtestData.dCart(1, 1);
      const order = ptestData.pOrderWithItems(1);
      const checkoutSession = stripeCheckoutSession();
      const error = new Error("Failed to update order");

      requireUserMock.mockResolvedValue(user);
      getCartMock.mockResolvedValue(cart);
      pCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);
      pUpdateOrderWithStripeDetailsMock.mockRejectedValue(error);
      formatErrorMock.mockReturnValue("Failed to update order");

      const result = await createCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Failed to update order",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(getCartMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(pUpdateOrderWithStripeDetailsMock).toHaveBeenCalledTimes(1);
      expect(formatErrorMock).toHaveBeenCalledTimes(1);
      expect(formatErrorMock).toHaveBeenCalledWith(error);
   });

   it("createCheckoutSession - user with no email - test", async () => {
      const user = dtestData.dLoginUser();
      user.email = null;
      const cart = dtestData.dCart(1, 1);
      const order = ptestData.pOrderWithItems(1);
      const checkoutSession = stripeCheckoutSession();

      requireUserMock.mockResolvedValue(user);
      getCartMock.mockResolvedValue(cart);
      pCreateOrderMock.mockResolvedValue(order);
      stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);
      pUpdateOrderWithStripeDetailsMock.mockResolvedValue(order);

      const result = await createCheckoutSession();
      const expectedResult = {
         success: true,
         message: "Checkout session created",
         data: {
            sessionId: "session-1",
            url: "https://checkout.stripe.com/session-1",
         },
      };

      expect(result).toEqual(expectedResult);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
         expect.objectContaining({
            customer_email: undefined,
         })
      );
   });
});
