import {
   keepPreviousData,
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

import {
   AddTemplateToCollectionParams,
   RemoveTemplateFromCollectionParams,
} from "./types";
import { collectionKeys } from "./utils";

export const useCollectionTemplateIds = (
   collectionId: string
): UseQueryResult<string[]> => {
   return useQuery({
      queryKey: collectionKeys.collectionTemplates(collectionId),
      queryFn: () => getCollectionTemplateIds(collectionId),
      placeholderData: keepPreviousData,
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
   RemoveTemplateFromCollectionParams
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
