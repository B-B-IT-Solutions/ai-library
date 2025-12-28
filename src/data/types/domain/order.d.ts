import { DProduct } from "./product";

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
   productType: string;
   price: number;
   createdAt: string;
};
