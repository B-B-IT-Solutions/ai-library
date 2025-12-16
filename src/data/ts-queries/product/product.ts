import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
   getBundles,
   getProductById,
   getProducts,
   getProductsByType,
   getSubscriptionPlans,
} from "@/data/actions/product/product.actions";
import { DProduct, DProductType } from "@/data/types/domain/product";

export const useLoadProducts = () => {
   return useQuery({
      queryKey: ["products"],
      queryFn: () => getProducts(),
      staleTime: 5 * 60 * 1000,
   });
};

export const useLoadProductById = (id: string) => {
   return useQuery({
      queryKey: ["product", id],
      queryFn: () => getProductById(id),
      staleTime: 5 * 60 * 1000,
      enabled: !!id,
   });
};

export const useLoadBundles = () => {
   return useQuery({
      queryKey: ["bundles"],
      queryFn: () => getBundles(),
      staleTime: 5 * 60 * 1000,
   });
};

export const useLoadSubscriptionPlans = () => {
   return useQuery({
      queryKey: ["subscriptionPlans"],
      queryFn: () => getSubscriptionPlans(),
      staleTime: 5 * 60 * 1000,
   });
};

export const useLoadProductsByType = (type: DProductType) => {
   return useQuery({
      queryKey: ["products", type],
      queryFn: () => getProductsByType(type),
      staleTime: 5 * 60 * 1000,
   });
};

// Preload options for SSR
export const preloadProductsOptions = () => ({
   queryKey: ["products"],
   queryFn: () => getProducts(),
});

export const preloadBundlesOptions = () => ({
   queryKey: ["bundles"],
   queryFn: () => getBundles(),
});

export const preloadSubscriptionPlansOptions = () => ({
   queryKey: ["subscriptionPlans"],
   queryFn: () => getSubscriptionPlans(),
});
