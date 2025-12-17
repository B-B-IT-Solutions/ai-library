import { DProduct } from "@/data/types/domain/product";

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
