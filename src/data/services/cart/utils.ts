import { CartWithItems } from "@/data/types/db/cart";

export const calculateSubTotalAmount = (cart: CartWithItems) => {
   const subTotal = cart.items.reduce((sum, item) => {
      const price = Number(item.productPrice);
      return sum + price * item.quantity;
   }, 0);

   return Number(subTotal.toFixed(2));
};
