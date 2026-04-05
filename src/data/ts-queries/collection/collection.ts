import {
   keepPreviousData,
   UndefinedInitialDataOptions,
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

export const loadCollectionTemplateIdsOptions = (
   collectionId: string
): UndefinedInitialDataOptions<string[], Error, string[]> => {
   return {
      queryKey: collectionKeys.collectionTemplateIds(collectionId),
      queryFn: () => getCollectionTemplateIds(collectionId),
      placeholderData: keepPreviousData,
      staleTime: 2 * 60 * 1000,
   };
};

export const useLoadCollectionTemplateIds = (
   collectionId: string
): UseQueryResult<string[]> => {
   const options = loadCollectionTemplateIdsOptions(collectionId);
   return useQuery(options);
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
            collectionKeys.collectionTemplateIds(collectionId),
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
            collectionKeys.collectionTemplateIds(collectionId),
            (prev) => prev?.filter((id) => id !== templateDescriptorId)
         );
         queryClient.invalidateQueries({
            queryKey: collectionKeys.collections(),
         });
      },
   });
};
