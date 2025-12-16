import { map } from "es-toolkit/compat";

import { toDProduct } from "@/data/actions/product/product.mapper";
import { DOrder, DOrderItem, DOrderStatus } from "@/data/types/domain/order";

type PrismaOrder = {
   id: string;
   userId: string;
   status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
   totalAmount: any;
   paymentMethod: string | null;
   createdAt: Date;
   updatedAt: Date;
   items: any[];
};

type PrismaOrderItem = {
   id: string;
   orderId: string;
   productId: string;
   quantity: number;
   price: any;
   createdAt: Date;
   product: any;
};

export const toDOrders = (orders: PrismaOrder[]): DOrder[] => {
   return map(orders, (o) => toDOrder(o));
};

export const toDOrder = (order: PrismaOrder): DOrder => {
   return {
      id: order.id,
      userId: order.userId,
      status: order.status as DOrderStatus,
      totalAmount: Number(order.totalAmount),
      paymentMethod: order.paymentMethod ?? undefined,
      items: map(order.items, (item) => toDOrderItem(item)),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
   };
};

export const toDOrderItem = (item: PrismaOrderItem): DOrderItem => {
   return {
      id: item.id,
      orderId: item.orderId,
      product: toDProduct(item.product),
      quantity: item.quantity,
      price: Number(item.price),
      createdAt: item.createdAt.toISOString(),
   };
};
