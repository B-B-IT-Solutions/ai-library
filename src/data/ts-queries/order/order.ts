import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
   createOrder,
   getOrderById,
   getUserOrders,
} from "@/data/actions/order/order.actions";

export const usePlaceOrder = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (paymentMethodId?: string) => createOrder(paymentMethodId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["cart"] });
         queryClient.invalidateQueries({ queryKey: ["orders"] });
         queryClient.invalidateQueries({ queryKey: ["purchases"] });
         queryClient.invalidateQueries({ queryKey: ["subscription"] });
      },
   });
};

export const useLoadOrders = () => {
   return useQuery({
      queryKey: ["orders"],
      queryFn: () => getUserOrders(),
      staleTime: 5 * 60 * 1000,
   });
};

export const useLoadOrderById = (orderId: string) => {
   return useQuery({
      queryKey: ["order", orderId],
      queryFn: () => getOrderById(orderId),
      staleTime: 5 * 60 * 1000,
      enabled: !!orderId,
   });
};

// Preload options for SSR
export const preloadOrdersOptions = () => ({
   queryKey: ["orders"],
   queryFn: () => getUserOrders(),
});

export const preloadOrderByIdOptions = (orderId: string) => ({
   queryKey: ["order", orderId],
   queryFn: () => getOrderById(orderId),
});
