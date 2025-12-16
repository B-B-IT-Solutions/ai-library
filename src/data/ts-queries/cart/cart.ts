import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
   addToCart,
   clearCart,
   getCartSummary,
   removeFromCart,
   updateCartItemQuantity,
} from "@/data/actions/cart/cart.actions";

export const useCart = () => {
   return useQuery({
      queryKey: ["cart"],
      queryFn: () => getCartSummary(),
      staleTime: 1 * 60 * 1000, // 1 minute
   });
};

export const useAddToCart = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ productId, quantity }: { productId: string; quantity?: number }) =>
         addToCart(productId, quantity),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["cart"] });
      },
   });
};

export const useRemoveFromCart = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (itemId: string) => removeFromCart(itemId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["cart"] });
      },
   });
};

export const useUpdateCartQuantity = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
         updateCartItemQuantity(itemId, quantity),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["cart"] });
      },
   });
};

export const useClearCart = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: () => clearCart(),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["cart"] });
      },
   });
};

// Preload option for SSR
export const preloadCartOptions = () => ({
   queryKey: ["cart"],
   queryFn: () => getCartSummary(),
});
