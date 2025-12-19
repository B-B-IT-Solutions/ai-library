import { ProductWithTemplateBundleItems } from "@/data/types/db/product";
import { Cart, CartItem } from "@/generated/prisma/client";

export type CartItemWithProduct = CartItem & {
   product: ProductWithTemplateBundleItems;
};

export type CartWithItems = Cart & {
   items: CartItemWithProduct[];
};
