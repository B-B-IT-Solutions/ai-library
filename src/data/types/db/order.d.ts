import { Order, OrderItem } from "@/generated/prisma/client";

export type OrderWithItems = Order & {
   items: OrderItem[];
};

export type OrderItemProduct = {
   product: {
      id: string;
      productItems: {
         templateId: string;
      }[];
   };
};

export type OrderProducts = {
   id: string;
   userId: string;
   items: OrderItemProduct[];
};
