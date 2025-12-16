import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
   copyTemplateToPrompts,
   downloadTemplate,
   getPurchasedTemplates,
} from "@/data/actions/library/library.actions";
import {
   cancelSubscription,
   checkSubscriptionAccess,
   getActiveSubscription,
} from "@/data/actions/subscription/subscription.actions";

export const useLoadPurchasedTemplates = () => {
   return useQuery({
      queryKey: ["purchases"],
      queryFn: () => getPurchasedTemplates(),
      staleTime: 5 * 60 * 1000,
   });
};

export const useCopyTemplateToPrompts = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (templateId: string) => copyTemplateToPrompts(templateId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["prompts"] });
      },
   });
};

export const useDownloadTemplate = () => {
   return useMutation({
      mutationFn: (templateId: string) => downloadTemplate(templateId),
   });
};

export const useLoadActiveSubscription = () => {
   return useQuery({
      queryKey: ["subscription"],
      queryFn: () => getActiveSubscription(),
      staleTime: 5 * 60 * 1000,
   });
};

export const useCheckSubscriptionAccess = () => {
   return useQuery({
      queryKey: ["subscriptionAccess"],
      queryFn: () => checkSubscriptionAccess(),
      staleTime: 5 * 60 * 1000,
   });
};

export const useCancelSubscription = () => {
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: (subscriptionId: string) => cancelSubscription(subscriptionId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ["subscription"] });
         queryClient.invalidateQueries({ queryKey: ["subscriptionAccess"] });
      },
   });
};

// Preload options for SSR
export const preloadPurchasedTemplatesOptions = () => ({
   queryKey: ["purchases"],
   queryFn: () => getPurchasedTemplates(),
});

export const preloadActiveSubscriptionOptions = () => ({
   queryKey: ["subscription"],
   queryFn: () => getActiveSubscription(),
});
