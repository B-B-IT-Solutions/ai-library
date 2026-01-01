import { DCartItem } from "@/data/types/domain/cart";

export const toStripePriceUnit = (item: DCartItem) => {
   return Math.round(item.productPrice * 100); // Convert to cents
};
