"use client";

import { useMemo, useState } from "react";
import { filter, flatMap, includes, isEmpty, map } from "es-toolkit/compat";
import { Check, Loader, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import InfiniteScroll from "@/components/shadcn/infinite-scroll";
import { Input } from "@/components/shadcn/input";
import {
   AddPromptToCollectionParams,
   RemovePromptFromCollectionParams,
   useAddPromptToCollection,
   useLoadCollectionPromptIds,
   useRemovePromptFromCollection,
} from "@/data/ts-queries/collection";
import { useInfiniteLoadPromptsPage } from "@/data/ts-queries/prompt";
import { DPrompt } from "@/data/types/domain/prompt";

type Props = {
   collectionId: string;
};

export const CollectionPrompts = ({ collectionId }: Props) => {
   const [search, setSearch] = useState("");
   const [pendingId, setPendingId] = useState<string | null>(null);

   const { mutate: addPrompt } = useAddPromptToCollection();
   const { mutate: removePrompt } = useRemovePromptFromCollection();

   const { data: promptIds = [], isLoading: idsLoading } =
      useLoadCollectionPromptIds(collectionId);

   const { data, fetchNextPage, hasNextPage, isFetching } =
      useInfiniteLoadPromptsPage({
         filters: { search: search || undefined },
      });

   const allPrompts = useMemo(
      () => flatMap(data?.pages, (page) => page.content),
      [data]
   );

   const inCollection = filter(allPrompts, (t) => includes(promptIds, t.id));

   const notInCollection = filter(
      allPrompts,
      (t) => !includes(promptIds, t.id)
   );

   const addPromptToCollection = (prompt: DPrompt) => {
      const params: AddPromptToCollectionParams = {
         collectionId,
         promptId: prompt.id,
      };
      addPrompt(params, {
         onSuccess: (result) => {
            if (!result.success) {
               toast.error(result.message);
            }
         },
         onSettled: () => setPendingId(null),
      });
   };

   const removePromptFromCollection = (prompt: DPrompt) => {
      const params: RemovePromptFromCollectionParams = {
         collectionId,
         promptId: prompt.id,
      };
      removePrompt(params, {
         onSuccess: (result) => {
            if (!result.success) {
               toast.error(result.message);
            }
         },
         onSettled: () => setPendingId(null),
      });
   };

   const handleToggle = (descriptor: DPrompt, isIn: boolean) => {
      setPendingId(descriptor.id);

      if (isIn) {
         removePromptFromCollection(descriptor);
      } else {
         addPromptToCollection(descriptor);
      }
   };

   const rowControlBtn = (descriptor: DPrompt, isIn: boolean) => {
      const isPending = pendingId === descriptor.id;
      return (
         <Button
            variant={isIn ? "ghost" : "outline"}
            size="sm"
            className="h-7 shrink-0 cursor-pointer gap-1.5 px-2"
            onClick={() => handleToggle(descriptor, isIn)}
            disabled={isPending}
            data-testid={`${isIn ? "remove" : "add"}-template-btn`}
         >
            {isPending ? (
               <Loader
                  className="h-3.5 w-3.5 animate-spin"
                  data-testid="loader-icon"
               />
            ) : isIn ? (
               <>
                  <Check className="h-3.5 w-3.5 text-green-600 group-hover:hidden" />
                  <X className="hidden h-3.5 w-3.5 text-slate-400 group-hover:inline" />
               </>
            ) : (
               <Plus className="h-3.5 w-3.5" />
            )}
         </Button>
      );
   };

   const renderRow = (descriptor: DPrompt, isIn: boolean) => {
      return (
         <div
            key={descriptor.id}
            className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50"
            data-testid={`template-row-${isIn}`}
         >
            <div className="flex-1">
               <p className="truncate text-sm font-medium text-slate-900">
                  {descriptor.title}
               </p>
            </div>
            {descriptor.recommendedModel && (
               <Badge variant="secondary" className="shrink-0 text-xs">
                  {descriptor.recommendedModel}
               </Badge>
            )}
            {rowControlBtn(descriptor, isIn)}
         </div>
      );
   };

   const promptsInCollection = () => {
      if (isEmpty(inCollection)) {
         return (
            <div
               className="py-6 text-center text-sm text-slate-400"
               data-testid="in-collection-empty"
            >
               Noch keine Vorlagen hinzugefügt
            </div>
         );
      }
      return map(inCollection, (t) => renderRow(t, true));
   };

   const promptsNotInCollection = () => {
      if (isEmpty(notInCollection)) {
         const text = isEmpty(allPrompts)
            ? "Keine Vorlagen gefunden"
            : "Keine weiteren Vorlagen gefunden";

         return (
            <div
               className="py-6 text-center text-sm text-slate-400"
               data-testid="not-in-collection-empty"
            >
               {text}
            </div>
         );
      }
      return (
         <InfiniteScroll
            hasMore={hasNextPage}
            isLoading={isFetching}
            next={fetchNextPage}
            threshold={0.7}
         >
            {map(notInCollection, (t) => renderRow(t, false))}
         </InfiniteScroll>
      );
   };

   const promptsList = () => {
      if (idsLoading) {
         return (
            <div
               className="flex justify-center py-8"
               data-testid="templates-loading"
            >
               <Loader className="h-5 w-5 animate-spin text-slate-400" />
            </div>
         );
      }
      return (
         <div
            className="max-h-130 overflow-y-auto bg-white"
            data-testid="templates-list"
         >
            <div>
               <div className="sticky top-0 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  In dieser Sammlung ({promptIds.length})
               </div>
               {promptsInCollection()}
            </div>

            <div>
               <div className="sticky top-0 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                  Weitere Vorlagen
               </div>
               {promptsNotInCollection()}
            </div>
         </div>
      );
   };

   return (
      <div className="rounded-xl bg-white p-6 shadow-sm" data-testid="collection-prompts">
         <div className="flex flex-col gap-4">
            <div className="relative" data-testid="templates-search">
               <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
               <Input
                  placeholder="Vorlagen durchsuchen..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  data-testid="search-input"
               />
            </div>
            {promptsList()}
         </div>
      </div>
   );
};
