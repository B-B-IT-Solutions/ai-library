import {
   keepPreviousData,
   QueryClient,
   UndefinedInitialDataOptions,
   useMutation,
   UseMutationOptions,
   UseMutationResult,
   useQuery,
   useQueryClient,
   UseQueryResult,
} from "@tanstack/react-query";
import { filter, isEmpty } from "es-toolkit/compat";

import {
   addPromptToCollection,
   getCollectionPromptIds,
   removePromptFromCollection,
} from "@/data/actions/collection";
import { ActionResult } from "@/data/types/utils";

import {
   AddTemplateToCollectionParams,
   RemoveTemplateFromCollectionParams,
} from "./types";
import { collectionKeys } from "./utils";

export const loadCollectionPromptIdsOptions = (
   collectionId: string
): UndefinedInitialDataOptions<string[], Error, string[]> => {
   return {
      queryKey: collectionKeys.collectionTemplateIds(collectionId),
      queryFn: () => getCollectionPromptIds(collectionId),
      placeholderData: keepPreviousData,
      staleTime: 2 * 60 * 1000,
   };
};

export const useLoadCollectionPromptIds = (
   collectionId: string
): UseQueryResult<string[]> => {
   const options = loadCollectionPromptIdsOptions(collectionId);
   return useQuery(options);
};

export const addTemplateToCollectionOptions = (
   queryClient: QueryClient
): UseMutationOptions<ActionResult, Error, AddTemplateToCollectionParams> => {
   return {
      mutationFn: (params) => {
         const { collectionId, promptId } = params;
         return addPromptToCollection(collectionId, promptId);
      },
      onSuccess: (_, params) => {
         const updater = (templateIds: string[]) => {
            if (isEmpty(templateIds)) {
               return [params.promptId];
            }
            return [...templateIds, params.promptId];
         };
         queryClient.setQueryData(
            collectionKeys.collectionTemplateIds(params.collectionId),
            updater
         );
      },
   };
};

export const useAddTemplateToCollection = (): UseMutationResult<
   ActionResult,
   Error,
   AddTemplateToCollectionParams
> => {
   const queryClient = useQueryClient();
   const options = addTemplateToCollectionOptions(queryClient);
   return useMutation(options);
};

export const removeTemplateFromCollectionOptions = (
   queryClient: QueryClient
): UseMutationOptions<
   ActionResult,
   Error,
   RemoveTemplateFromCollectionParams
> => {
   return {
      mutationFn: (params) => {
         const { collectionId, promptId } = params;
         return removePromptFromCollection(collectionId, promptId);
      },
      onSuccess: (_, params) => {
         const updater = (templateIds: string[]) => {
            return filter(templateIds, (id) => id != params.promptId);
         };
         queryClient.setQueryData(
            collectionKeys.collectionTemplateIds(params.collectionId),
            updater
         );
      },
   };
};

export const useRemoveTemplateFromCollection = (): UseMutationResult<
   ActionResult,
   Error,
   RemoveTemplateFromCollectionParams
> => {
   const queryClient = useQueryClient();
   const options = removeTemplateFromCollectionOptions(queryClient);
   return useMutation(options);
};
