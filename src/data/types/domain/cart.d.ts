import { DProduct } from "./product";

export type DCart = {
   id: string;
   userId?: string;
   sessionCartId?: string;
   subtotal: number;
   total: number;
   createdAt: string;
   updatedAt: string;
   items: DCartItem[];
};

export type DCartItem = {
   id: string;
   cartId: string;
   product: DProduct;
   quantity: number;
   lineTotal: number;
   createdAt: string;
   updatedAt: string;
};

export type DCartSummary = {
   itemCount: number;
   subtotal: number;
   total: number;
};
