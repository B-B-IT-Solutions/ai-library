import { Order, OrderItem } from "@/generated/prisma/client";

export type OrderWithItems = Order & {
   items: OrderItem[];
};
