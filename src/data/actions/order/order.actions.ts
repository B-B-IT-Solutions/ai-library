"use server";

import { validate as isValidUuid } from "uuid";

import { requireUser } from "@/data/actions/auth-utils";
import { formatError } from "@/data/actions/utils";
import prisma from "@/data/repositories/prisma";
import { ServiceFactory } from "@/data/services";
import { DbClient } from "@/data/types/db/common";
import { DOrder } from "@/data/types/domain/order";

export const getOrders = async (): Promise<DOrder[]> => {
   try {
      const user = await requireUser();
      const service = getSevice();
      return service.getOrders(user.id);
   } catch (error) {
      console.error(formatError(error));
      return [];
   }
};

export const getOrder = async (orderId: string): Promise<DOrder | null> => {
   try {
      if (!isValidUuid(orderId)) {
         throw new Error("Invalid order ID.");
      }
      const user = await requireUser();

      const service = getSevice();
      return service.getOrder(orderId, user.id);
   } catch (error) {
      console.error(formatError(error));
      return null;
   }
};

const getSevice = (dbClient: DbClient = prisma) => {
   const factory = new ServiceFactory(dbClient);
   return factory.getOrderService();
};
