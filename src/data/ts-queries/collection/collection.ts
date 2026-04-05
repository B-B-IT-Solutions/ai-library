import {
   useMutation,
   UseMutationResult,
   useQuery,
   useQueryClient,
   UseQueryResult,
} from "@tanstack/react-query";

import {
   addTemplateToCollection,
   getCollectionTemplateIds,
   removeTemplateFromCollection,
} from "@/data/actions/collection";
import { ActionResult } from "@/data/types/utils";

import { AddTemplateToCollectionParams } from "./types";
import { collectionKeys } from "./utils";

export const useCollectionTemplateIds = (
   collectionId: string
): UseQueryResult<string[]> => {
   return useQuery({
      queryKey: collectionKeys.collectionTemplates(collectionId),
      queryFn: () => getCollectionTemplateIds(collectionId),
      staleTime: 2 * 60 * 1000,
   });
};

export const useAddTemplateToCollection = (): UseMutationResult<
   ActionResult,
   Error,
   AddTemplateToCollectionParams
> => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ collectionId, templateDescriptorId }) =>
         addTemplateToCollection(collectionId, templateDescriptorId),
      onSuccess: (_, { collectionId, templateDescriptorId }) => {
         queryClient.setQueryData<string[]>(
            collectionKeys.collectionTemplates(collectionId),
            (prev) =>
               prev ? [...prev, templateDescriptorId] : [templateDescriptorId]
         );
         queryClient.invalidateQueries({
            queryKey: collectionKeys.collections(),
         });
      },
   });
};

export const useRemoveTemplateFromCollection = (): UseMutationResult<
   ActionResult,
   Error,
   { collectionId: string; templateDescriptorId: string }
> => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: ({ collectionId, templateDescriptorId }) =>
         removeTemplateFromCollection(collectionId, templateDescriptorId),
      onSuccess: (_, { collectionId, templateDescriptorId }) => {
         queryClient.setQueryData<string[]>(
            collectionKeys.collectionTemplates(collectionId),
            (prev) => prev?.filter((id) => id !== templateDescriptorId)
         );
         queryClient.invalidateQueries({
            queryKey: collectionKeys.collections(),
         });
      },
   });
};
