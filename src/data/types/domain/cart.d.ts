import { DProduct } from "@/data/types/domain/product";

export type DCart = {
   id: string;
   userId: string | null;
   sessionCartId: string | null;
   subtotal: number;
   total: number;
   createdAt: string;
   updatedAt: string;
   items: DCartItem[];
};

export type DCartItem = {
   id: string;
   cartId: string;
   productId: string;
   productName: string;
   productType: string;
   productPrice: number;
   quantity: number;
   lineTotal: number;
   createdAt: string;
   updatedAt: string;
};
