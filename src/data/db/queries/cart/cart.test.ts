import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/db/prisma";
import { CartFindFirstArgs } from "@/generated/prisma/models";

import { pGetCartByUserId } from "./cart";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("pGetCartByUserId tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pGetCartByUserId test", async () => {
      const cart = ptestData.pCart();
      prismaMock.cart.findFirst.mockResolvedValue(cart);

      const userId = "1";
      const result = await pGetCartByUserId(userId);

      const expectedFindFirstArgs: CartFindFirstArgs = {
         where: { userId },
         include: {
            items: {
               include: {
                  product: {
                     include: {
                        template: {
                           include: {
                              categories: true,
                           },
                        },
                        bundleItems: {
                           include: {
                              template: {
                                 include: {
                                    categories: true,
                                 },
                              },
                           },
                        },
                     },
                  },
               },
            },
         },
      };

      expect(result).toEqual(cart);
      expect(prismaMock.cart.findFirst).toHaveBeenCalledTimes(1);
      expect(prismaMock.cart.findFirst).toHaveBeenCalledWith(
         expectedFindFirstArgs
      );
   });
});
