import { PrismaClient } from "@prisma/client";
import { ptestData } from "@tests";
import { map } from "es-toolkit/compat";
import { DeepMockProxy, mockReset } from "jest-mock-extended";

import prisma from "@/data/db/prisma";
import { OrderCreateArgs, OrderCreateInput } from "@/generated/prisma/models";

import { pCreateOrder } from "./order";

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe("pCreateOrder tests", () => {
   beforeEach(() => {
      mockReset(prismaMock);
   });

   test("pCreateOrder test", async () => {
      const order = ptestData.pOrder();
      prismaMock.order.create.mockResolvedValue(order);

      const items = ptestData.pCartItems(3);
      const createInput: OrderCreateInput = {
         user: {
            connect: {
               id: "user-1",
            },
         },
         status: "PENDING",
         totalAmount: 27.99,
         items: {
            create: map(items, (i) => ({
               product: {
                  connect: {
                     id: i.productId,
                  },
               },
               quantity: i.quantity,
               price: 9.99,
            })),
         },
      };
      const result = await pCreateOrder(createInput);

      const expectedOrderCreateArgs: OrderCreateArgs = {
         data: createInput,
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
            purchases: {
               include: {
                  template: {
                     include: {
                        categories: true,
                     },
                  },
               },
            },
         },
      };

      expect(result).toEqual(order);
      expect(prismaMock.order.create).toHaveBeenCalledTimes(1);
      expect(prismaMock.order.create).toHaveBeenCalledWith(
         expectedOrderCreateArgs
      );
   });
});
