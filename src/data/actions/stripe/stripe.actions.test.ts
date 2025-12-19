jest.mock("@/data/db/queries/cart");
jest.mock("@/data/db/queries/order");
jest.mock("@/lib/stripe/stripe-server");
jest.mock("../auth-utils");
jest.mock("../utils");

import { Decimal } from "@prisma/client/runtime/library";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";
import Stripe from "stripe";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import { pGetCartByUserId } from "@/data/db/queries/cart";
import {
   pCreateOrder,
   pUpdateOrderWithStripeDetails,
} from "@/data/db/queries/order";
import { stripe } from "@/lib/stripe/stripe-server";

import { createCheckoutSession } from "./stripe.actions";

const requireUserMock = requireUser as jest.MockedFunction<typeof requireUser>;
const pGetCartByUserIdMock = pGetCartByUserId as jest.MockedFunction<
   typeof pGetCartByUserId
>;
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
      // mockReset(stripeMock);
   });

   it("createCheckoutSession - successful checkout with single item - test", async () => {
      const user = dtestData.dLoginUser();
      const product = ptestData.pProduct(1);
      const cart = ptestData.pCartWithItems(1, 1);
      cart.items[0].product = {
         ...product,
         template: ptestData.pPromptTemplateWithCategories(1),
         bundleItems: [],
      };
      cart.items[0].quantity = 1;

      const order = ptestData.pOrder(1);
      const checkoutSession = stripeCheckoutSession();

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockResolvedValue(cart);
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
         totalAmount: 29.99,
         items: {
            create: [
               {
                  product: {
                     connect: {
                        id: cart.items[0].product.id,
                     },
                  },
                  quantity: 1,
                  price: 29.99,
               },
            ],
         },
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledWith(user.id);
      expect(pCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).toHaveBeenCalledWith(expectOrderCreateInput);

      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith({
         mode: "payment",
         payment_method_types: ["card"],
         line_items: [
            {
               price_data: {
                  currency: "chf",
                  product_data: {
                     name: product.name,
                     description: product.description,
                  },
                  unit_amount: 2999,
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
      });

      expect(pUpdateOrderWithStripeDetailsMock).toHaveBeenCalledTimes(1);
      expect(pUpdateOrderWithStripeDetailsMock).toHaveBeenCalledWith(order.id, {
         stripeCheckoutSessionId: "session-1",
         stripePaymentStatus: "unpaid",
      });
   });

   it("createCheckoutSession - successful checkout with multiple items - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const product1 = {
         ...ptestData.pProduct(1),
         price: new Decimal(19.99),
      };
      const product2 = {
         ...ptestData.pProduct(2),
         price: new Decimal(39.99),
         description: null,
      };

      const cart = ptestData.pCartWithItems(1, 2);
      cart.items[0].product = {
         ...product1,
         template: ptestData.pPromptTemplateWithCategories(1),
         bundleItems: [],
      };
      cart.items[0].quantity = 2;
      cart.items[1].product = {
         ...product2,
         template: ptestData.pPromptTemplateWithCategories(2),
         bundleItems: [],
      };
      cart.items[1].quantity = 1;

      const totalAmount = 19.99 * 2 + 39.99;
      const order = {
         ...ptestData.pOrder(1),
         id: "order-1",
         userId: user.id,
         totalAmount: new Decimal(totalAmount),
         status: "PENDING" as const,
      };

      const checkoutSession = {
         id: "session-1",
         url: "https://checkout.stripe.com/session-1",
      };

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockResolvedValue(cart);
      pCreateOrderMock.mockResolvedValue(order as any);
      stripeMock.checkout.sessions.create = jest
         .fn()
         .mockResolvedValue(checkoutSession as any);
      pUpdateOrderWithStripeDetailsMock.mockResolvedValue(order as any);

      const result = await createCheckoutSession();

      expect(result).toEqual({
         success: true,
         message: "Checkout session created",
         data: {
            sessionId: "session-1",
            url: "https://checkout.stripe.com/session-1",
         },
      });

      expect(pCreateOrderMock).toHaveBeenCalledWith({
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
                        id: cart.items[0].product.id,
                     },
                  },
                  quantity: 2,
                  price: 19.99,
               },
               {
                  product: {
                     connect: {
                        id: cart.items[1].product.id,
                     },
                  },
                  quantity: 1,
                  price: 39.99,
               },
            ],
         },
      });

      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
         expect.objectContaining({
            line_items: [
               {
                  price_data: {
                     currency: "chf",
                     product_data: {
                        name: product1.name,
                        description: product1.description,
                     },
                     unit_amount: 1999,
                  },
                  quantity: 2,
               },
               {
                  price_data: {
                     currency: "chf",
                     product_data: {
                        name: product2.name,
                        description: undefined,
                     },
                     unit_amount: 3999,
                  },
                  quantity: 1,
               },
            ],
         })
      );
   });

   it("createCheckoutSession - cart is null - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockResolvedValue(null);

      const result = await createCheckoutSession();

      expect(result).toEqual({
         success: false,
         message: "Your cart is empty.",
      });

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledWith(user.id);
      expect(pCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
   });

   it("createCheckoutSession - cart has empty items - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const cart = ptestData.pCartWithItems(1, 0);

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockResolvedValue(cart);

      const result = await createCheckoutSession();

      expect(result).toEqual({
         success: false,
         message: "Your cart is empty.",
      });

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
   });

   it("createCheckoutSession - user not authenticated - test", async () => {
      const error = new Error("Authentication required");
      requireUserMock.mockRejectedValue(error);
      formatErrorMock.mockReturnValue("Authentication required");

      const result = await createCheckoutSession();

      expect(result).toEqual({
         success: false,
         message: "Authentication required",
      });

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).not.toHaveBeenCalled();
      expect(pCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
      expect(formatErrorMock).toHaveBeenCalledWith(error);
   });

   it("createCheckoutSession - pGetCartByUserId throws error - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const error = new Error("Database error");

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockRejectedValue(error);
      formatErrorMock.mockReturnValue("Database error");

      const result = await createCheckoutSession();

      expect(result).toEqual({
         success: false,
         message: "Database error",
      });

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
      expect(formatErrorMock).toHaveBeenCalledWith(error);
   });

   it("createCheckoutSession - pCreateOrder throws error - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const cart = ptestData.pCartWithItems(1, 1);
      const error = new Error("Failed to create order");

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockResolvedValue(cart);
      pCreateOrderMock.mockRejectedValue(error);
      formatErrorMock.mockReturnValue("Failed to create order");

      const result = await createCheckoutSession();

      expect(result).toEqual({
         success: false,
         message: "Failed to create order",
      });

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
      expect(formatErrorMock).toHaveBeenCalledWith(error);
   });

   it("createCheckoutSession - stripe.checkout.sessions.create throws error - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const cart = ptestData.pCartWithItems(1, 1);
      const order = ptestData.pOrder(1);
      const error = new Error("Stripe API error");

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockResolvedValue(cart);
      pCreateOrderMock.mockResolvedValue(order as any);
      stripeMock.checkout.sessions.create = jest.fn().mockRejectedValue(error);
      formatErrorMock.mockReturnValue("Stripe API error");

      const result = await createCheckoutSession();

      expect(result).toEqual({
         success: false,
         message: "Stripe API error",
      });

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
      expect(formatErrorMock).toHaveBeenCalledWith(error);
   });

   it("createCheckoutSession - pUpdateOrderWithStripeDetails throws error - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const cart = ptestData.pCartWithItems(1, 1);
      const order = ptestData.pOrder(1);
      const checkoutSession = {
         id: "session-1",
         url: "https://checkout.stripe.com/session-1",
      };
      const error = new Error("Failed to update order");

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockResolvedValue(cart);
      pCreateOrderMock.mockResolvedValue(order as any);
      stripeMock.checkout.sessions.create = jest
         .fn()
         .mockResolvedValue(checkoutSession as any);
      pUpdateOrderWithStripeDetailsMock.mockRejectedValue(error);
      formatErrorMock.mockReturnValue("Failed to update order");

      const result = await createCheckoutSession();

      expect(result).toEqual({
         success: false,
         message: "Failed to update order",
      });

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(pUpdateOrderWithStripeDetailsMock).toHaveBeenCalledTimes(1);
      expect(formatErrorMock).toHaveBeenCalledWith(error);
   });

   it("createCheckoutSession - user with no email - test", async () => {
      const user = { id: "user-1", email: null };
      const cart = ptestData.pCartWithItems(1, 1);
      const order = ptestData.pOrder(1);
      const checkoutSession = {
         id: "session-1",
         url: "https://checkout.stripe.com/session-1",
      };

      requireUserMock.mockResolvedValue(user as any);
      pGetCartByUserIdMock.mockResolvedValue(cart);
      pCreateOrderMock.mockResolvedValue(order as any);
      stripeMock.checkout.sessions.create = jest
         .fn()
         .mockResolvedValue(checkoutSession as any);
      pUpdateOrderWithStripeDetailsMock.mockResolvedValue(order as any);

      const result = await createCheckoutSession();

      expect(result).toEqual({
         success: true,
         message: "Checkout session created",
         data: {
            sessionId: "session-1",
            url: "https://checkout.stripe.com/session-1",
         },
      });

      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
         expect.objectContaining({
            customer_email: undefined,
         })
      );
   });

   it("createCheckoutSession - product with null description - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const product = {
         ...ptestData.pProduct(1),
         description: null,
         price: new Decimal(29.99),
      };
      const cart = ptestData.pCartWithItems(1, 1);
      cart.items[0].product = {
         ...product,
         template: ptestData.pPromptTemplateWithCategories(1),
         bundleItems: [],
      };

      const order = ptestData.pOrder(1);
      const checkoutSession = {
         id: "session-1",
         url: "https://checkout.stripe.com/session-1",
      };

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockResolvedValue(cart);
      pCreateOrderMock.mockResolvedValue(order as any);
      stripeMock.checkout.sessions.create = jest
         .fn()
         .mockResolvedValue(checkoutSession as any);
      pUpdateOrderWithStripeDetailsMock.mockResolvedValue(order as any);

      const result = await createCheckoutSession();

      expect(result).toEqual({
         success: true,
         message: "Checkout session created",
         data: {
            sessionId: "session-1",
            url: "https://checkout.stripe.com/session-1",
         },
      });

      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
         expect.objectContaining({
            line_items: [
               {
                  price_data: {
                     currency: "chf",
                     product_data: {
                        name: product.name,
                        description: undefined,
                     },
                     unit_amount: 2999,
                  },
                  quantity: 1,
               },
            ],
         })
      );
   });

   it("createCheckoutSession - verifies price conversion to cents - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const product = {
         ...ptestData.pProduct(1),
         price: new Decimal(10.5),
      };
      const cart = ptestData.pCartWithItems(1, 1);
      cart.items[0].product = {
         ...product,
         template: ptestData.pPromptTemplateWithCategories(1),
         bundleItems: [],
      };

      const order = ptestData.pOrder(1);
      const checkoutSession = {
         id: "session-1",
         url: "https://checkout.stripe.com/session-1",
      };

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockResolvedValue(cart);
      pCreateOrderMock.mockResolvedValue(order as any);
      stripeMock.checkout.sessions.create = jest
         .fn()
         .mockResolvedValue(checkoutSession as any);
      pUpdateOrderWithStripeDetailsMock.mockResolvedValue(order as any);

      await createCheckoutSession();

      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
         expect.objectContaining({
            line_items: [
               {
                  price_data: {
                     currency: "chf",
                     product_data: {
                        name: product.name,
                        description: product.description,
                     },
                     unit_amount: 1050, // 10.50 * 100 = 1050
                  },
                  quantity: 1,
               },
            ],
         })
      );
   });

   it("createCheckoutSession - calculates total amount correctly - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const product1 = {
         ...ptestData.pProduct(1),
         price: new Decimal(15.5),
      };
      const product2 = {
         ...ptestData.pProduct(2),
         price: new Decimal(25.75),
      };

      const cart = ptestData.pCartWithItems(1, 2);
      cart.items[0].product = {
         ...product1,
         template: ptestData.pPromptTemplateWithCategories(1),
         bundleItems: [],
      };
      cart.items[0].quantity = 3;
      cart.items[1].product = {
         ...product2,
         template: ptestData.pPromptTemplateWithCategories(2),
         bundleItems: [],
      };
      cart.items[1].quantity = 2;

      const expectedTotal = 15.5 * 3 + 25.75 * 2; // 46.5 + 51.5 = 98.0

      const order = ptestData.pOrder(1);
      const checkoutSession = {
         id: "session-1",
         url: "https://checkout.stripe.com/session-1",
      };

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockResolvedValue(cart);
      pCreateOrderMock.mockResolvedValue(order as any);
      stripeMock.checkout.sessions.create = jest
         .fn()
         .mockResolvedValue(checkoutSession as any);
      pUpdateOrderWithStripeDetailsMock.mockResolvedValue(order as any);

      await createCheckoutSession();

      expect(pCreateOrderMock).toHaveBeenCalledWith(
         expect.objectContaining({
            totalAmount: expectedTotal,
         })
      );
   });
});
