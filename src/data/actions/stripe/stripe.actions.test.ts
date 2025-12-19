jest.mock("@/data/db/queries/cart");
jest.mock("@/data/db/queries/order");
jest.mock("@/lib/stripe/stripe-server");
jest.mock("../auth-utils");
jest.mock("../utils");

import { Decimal } from "@prisma/client/runtime/library";
import { dtestData, ptestData } from "@tests";
import { DeepMockProxy } from "jest-mock-extended";
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
      expect(pGetCartByUserIdMock).not.toHaveBeenCalled();
      expect(pCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
      expect(formatErrorMock).toHaveBeenCalledTimes(1);
      expect(formatErrorMock).toHaveBeenCalledWith(error);
   });

   it("createCheckoutSession - cart is null - test", async () => {
      const user = dtestData.dLoginUser();
      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockResolvedValue(null);

      const result = await createCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Your cart is empty.",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledWith(user.id);
      expect(pCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
   });

   it("createCheckoutSession - cart empty - test", async () => {
      const user = { id: "user-1", email: "test@email.com" };
      const cart = ptestData.pCartWithItems(1, 0);

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockResolvedValue(cart);

      const result = await createCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Your cart is empty.",
      };

      expect(result).toEqual(expectedResult);

      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
   });

   it("createCheckoutSession - successful checkout with single item - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = ptestData.pCartWithItems(1, 1);

      const order = ptestData.pOrderWithItems();
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

      const item1 = cart.items[0];
      const expectOrderCreateInput = {
         user: {
            connect: {
               id: user.id,
            },
         },
         status: "PENDING",
         totalAmount: 19.99,
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
      expect(pGetCartByUserIdMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledWith(user.id);
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
      const cart = ptestData.pCartWithItems(1, 2);
      const order = ptestData.pOrderWithItems();
      const totalAmount = 19.99 + 19.99;
      const item1 = cart.items[0];
      const item2 = cart.items[1];
      item2.productDescription = null;

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
      expect(pGetCartByUserIdMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledWith(user.id);
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

   it("createCheckoutSession - pGetCartByUserId throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const error = new Error("Database error");

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockRejectedValue(error);
      formatErrorMock.mockReturnValue("Database error");

      const result = await createCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Database error",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).not.toHaveBeenCalled();
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
      expect(formatErrorMock).toHaveBeenCalledTimes(1);
      expect(formatErrorMock).toHaveBeenCalledWith(error);
   });

   it("createCheckoutSession - pCreateOrder throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = ptestData.pCartWithItems(1, 1);
      const error = new Error("Failed to create order");

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockResolvedValue(cart);
      pCreateOrderMock.mockRejectedValue(error);
      formatErrorMock.mockReturnValue("Failed to create order");

      const result = await createCheckoutSession();
      const expectedResult = {
         success: false,
         message: "Failed to create order",
      };

      expect(result).toEqual(expectedResult);
      expect(requireUserMock).toHaveBeenCalledTimes(1);
      expect(pGetCartByUserIdMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).not.toHaveBeenCalled();
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
      expect(formatErrorMock).toHaveBeenCalledTimes(1);
      expect(formatErrorMock).toHaveBeenCalledWith(error);
   });

   it("createCheckoutSession - stripe.checkout.sessions.create throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = ptestData.pCartWithItems(1, 1);
      const order = ptestData.pOrderWithItems(1);
      const error = new Error("Stripe API error");

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockResolvedValue(cart);
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
      expect(pGetCartByUserIdMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(pUpdateOrderWithStripeDetailsMock).not.toHaveBeenCalled();
      expect(formatErrorMock).toHaveBeenCalledTimes(1);
      expect(formatErrorMock).toHaveBeenCalledWith(error);
   });

   it("createCheckoutSession - pUpdateOrderWithStripeDetails throws error - test", async () => {
      const user = dtestData.dLoginUser();
      const cart = ptestData.pCartWithItems(1, 1);
      const order = ptestData.pOrderWithItems(1);
      const checkoutSession = stripeCheckoutSession();
      const error = new Error("Failed to update order");

      requireUserMock.mockResolvedValue(user);
      pGetCartByUserIdMock.mockResolvedValue(cart);
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
      expect(pGetCartByUserIdMock).toHaveBeenCalledTimes(1);
      expect(pCreateOrderMock).toHaveBeenCalledTimes(1);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledTimes(1);
      expect(pUpdateOrderWithStripeDetailsMock).toHaveBeenCalledTimes(1);
      expect(formatErrorMock).toHaveBeenCalledTimes(1);
      expect(formatErrorMock).toHaveBeenCalledWith(error);
   });

   it("createCheckoutSession - user with no email - test", async () => {
      const user = dtestData.dLoginUser();
      user.email = null;
      const cart = ptestData.pCartWithItems(1, 1);
      const order = ptestData.pOrderWithItems(1);
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

      expect(result).toEqual(expectedResult);
      expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
         expect.objectContaining({
            customer_email: undefined,
         })
      );
   });

   // it("createCheckoutSession - verifies price conversion to cents - test", async () => {
   //    const user = { id: "user-1", email: "test@email.com" };
   //    const product = {
   //       ...ptestData.pProduct(1),
   //       price: new Decimal(10.5),
   //    };
   //    const cart = ptestData.pCartWithItems(1, 1);
   //    cart.items[0].product = {
   //       ...product,
   //       template: ptestData.pPromptTemplateWithCategories(1),
   //       bundleItems: [],
   //    };

   //    const order = ptestData.pOrderWithItems(1);
   //    const checkoutSession = stripeCheckoutSession();

   //    requireUserMock.mockResolvedValue(user);
   //    pGetCartByUserIdMock.mockResolvedValue(cart);
   //    pCreateOrderMock.mockResolvedValue(order);
   //    stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);
   //    pUpdateOrderWithStripeDetailsMock.mockResolvedValue(order);

   //    await createCheckoutSession();

   //    expect(stripeMock.checkout.sessions.create).toHaveBeenCalledWith(
   //       expect.objectContaining({
   //          line_items: [
   //             {
   //                price_data: {
   //                   currency: "chf",
   //                   product_data: {
   //                      name: product.name,
   //                      description: product.description,
   //                   },
   //                   unit_amount: 1050, // 10.50 * 100 = 1050
   //                },
   //                quantity: 1,
   //             },
   //          ],
   //       })
   //    );
   // });

   // it("createCheckoutSession - calculates total amount correctly - test", async () => {
   //    const user = { id: "user-1", email: "test@email.com" };
   //    const product1 = {
   //       ...ptestData.pProduct(1),
   //       price: new Decimal(15.5),
   //    };
   //    const product2 = {
   //       ...ptestData.pProduct(2),
   //       price: new Decimal(25.75),
   //    };

   //    const cart = ptestData.pCartWithItems(1, 2);
   //    cart.items[0].product = {
   //       ...product1,
   //       template: ptestData.pPromptTemplateWithCategories(1),
   //       bundleItems: [],
   //    };
   //    cart.items[0].quantity = 3;
   //    cart.items[1].product = {
   //       ...product2,
   //       template: ptestData.pPromptTemplateWithCategories(2),
   //       bundleItems: [],
   //    };
   //    cart.items[1].quantity = 2;

   //    const expectedTotal = 15.5 * 3 + 25.75 * 2; // 46.5 + 51.5 = 98.0

   //    const order = ptestData.pOrderWithItems(1);
   //    const checkoutSession = stripeCheckoutSession();

   //    requireUserMock.mockResolvedValue(user);
   //    pGetCartByUserIdMock.mockResolvedValue(cart);
   //    pCreateOrderMock.mockResolvedValue(order);
   //    stripeMock.checkout.sessions.create.mockResolvedValue(checkoutSession);
   //    pUpdateOrderWithStripeDetailsMock.mockResolvedValue(order);

   //    await createCheckoutSession();

   //    expect(pCreateOrderMock).toHaveBeenCalledWith(
   //       expect.objectContaining({
   //          totalAmount: expectedTotal,
   //       })
   //    );
   // });
});
