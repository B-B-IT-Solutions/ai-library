import { DProduct } from "./product";

export type DCart = {
   id: string;
   userId?: string;
   sessionCartId?: string;
   items: DCartItem[];
   subtotal: number;
   total: number;
   createdAt: string;
   updatedAt: string;
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
