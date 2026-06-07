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
   AddPromptToCollectionParams,
   RemovePromptFromCollectionParams,
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

export const addPromptToCollectionOptions = (
   queryClient: QueryClient
): UseMutationOptions<ActionResult, Error, AddPromptToCollectionParams> => {
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

export const useAddPromptToCollection = (): UseMutationResult<
   ActionResult,
   Error,
   AddPromptToCollectionParams
> => {
   const queryClient = useQueryClient();
   const options = addPromptToCollectionOptions(queryClient);
   return useMutation(options);
};

export const removePromptFromCollectionOptions = (
   queryClient: QueryClient
): UseMutationOptions<
   ActionResult,
   Error,
   RemovePromptFromCollectionParams
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

export const useRemovePromptFromCollection = (): UseMutationResult<
   ActionResult,
   Error,
   RemovePromptFromCollectionParams
> => {
   const queryClient = useQueryClient();
   const options = removePromptFromCollectionOptions(queryClient);
   return useMutation(options);
};
