import { DProductType } from "@/data/types/domain/product";

export type DOrderCreate = {
   totalAmount: number;
   items: DOrderItemCreate[];
};

export type DOrderItemCreate = {
   productId: string;
   productName: string;
   productDescription?: string;
   productType: DProductType;
   quantity: number;
   price: number;
};

export type DOrderUpdate = {
   status?: DOrderStatus;
   stripeCheckoutSessionId?: string;
   stripePaymentIntentId?: string;
   stripePaymentStatus?: string;
   paymentMethod?: string;
};

export type DOrderStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export type DOrder = {
   id: string;
   userId: string;
   status: DOrderStatus;
   totalAmount: number;
   paymentMethod: string | null;
   stripeCheckoutSessionId: string | null;
   stripePaymentIntentId: string | null;
   stripePaymentStatus: string | null;
   items: DOrderItem[];
   createdAt: string;
   updatedAt: string;
};

export type DOrderItem = {
   id: string;
   orderId: string;
   productId: string;
   productName: string;
   productDescription: string | null;
   productType: DProductType;
   price: number;
   createdAt: string;
};
