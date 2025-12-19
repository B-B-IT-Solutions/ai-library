import { Cart, CartItem } from "@/generated/prisma/client";

export type CartWithItems = Cart & {
   items: CartItem[];
};
