"use client";

import { useMemo, useState } from "react";
import { flatMap, includes } from "es-toolkit/compat";
import { Check, Loader, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/shadcn/badge";
import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import {
   useAddTemplateToCollection,
   useCollectionTemplateIds,
   useInfiniteLoadLibraryEntries,
   useRemoveTemplateFromCollection,
} from "@/data/ts-queries/library";
import { DPromptTemplateDescriptor } from "@/data/types/domain/prompt.template";

type Props = {
   collectionId: string;
};

export const CollectionTemplates = ({ collectionId }: Props) => {
   const [search, setSearch] = useState("");

   const { data: templateIds = [], isLoading: idsLoading } =
      useCollectionTemplateIds(collectionId);

   const { data, fetchNextPage, hasNextPage, isFetching } =
      useInfiniteLoadLibraryEntries({
         filters: { search: search || undefined },
      });

   const { mutate: addTemplate, isPending: isAdding } =
      useAddTemplateToCollection();
   const { mutate: removeTemplate, isPending: isRemoving } =
      useRemoveTemplateFromCollection();
   const [pendingId, setPendingId] = useState<string | null>(null);

   const allTemplates = useMemo(
      () => flatMap(data?.pages, (page) => page.content),
      [data]
   );

   const handleToggle = (descriptor: DPromptTemplateDescriptor) => {
      const isIn = includes(templateIds, descriptor.id);
      setPendingId(descriptor.id);
      if (isIn) {
         removeTemplate(
            { collectionId, templateDescriptorId: descriptor.id },
            {
               onSuccess: (result) => {
                  if (!result.success) toast.error(result.message);
               },
               onSettled: () => setPendingId(null),
            }
         );
      } else {
         addTemplate(
            { collectionId, templateDescriptorId: descriptor.id },
            {
               onSuccess: (result) => {
                  if (!result.success) toast.error(result.message);
               },
               onSettled: () => setPendingId(null),
            }
         );
      }
   };

   const inCollection = allTemplates.filter((t) => includes(templateIds, t.id));
   const notInCollection = allTemplates.filter(
      (t) => !includes(templateIds, t.id)
   );

   const renderRow = (descriptor: DPromptTemplateDescriptor, isIn: boolean) => {
      const isPending = pendingId === descriptor.id;
      return (
         <div
            key={descriptor.id}
            className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-slate-50"
         >
            <div className="min-w-0 flex-1">
               <p className="truncate text-sm font-medium text-slate-900">
                  {descriptor.title}
               </p>
               {descriptor.description && (
                  <p className="truncate text-xs text-slate-400">
                     {descriptor.description}
                  </p>
               )}
            </div>
            {descriptor.recommendedModel && (
               <Badge variant="secondary" className="shrink-0 text-xs">
                  {descriptor.recommendedModel}
               </Badge>
            )}
            <Button
               variant={isIn ? "ghost" : "outline"}
               size="sm"
               className="h-7 shrink-0 gap-1.5 px-2"
               onClick={() => handleToggle(descriptor)}
               disabled={isPending}
            >
               {isPending ? (
                  <Loader className="h-3.5 w-3.5 animate-spin" />
               ) : isIn ? (
                  <>
                     <Check className="h-3.5 w-3.5 text-green-600" />
                     <X className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100" />
                  </>
               ) : (
                  <Plus className="h-3.5 w-3.5" />
               )}
            </Button>
         </div>
      );
   };

   return (
      <div className="flex flex-col gap-4">
         {/* Search */}
         <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
               placeholder="Vorlagen durchsuchen..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="pl-9"
            />
         </div>

         {idsLoading ? (
            <div className="flex justify-center py-8">
               <Loader className="h-5 w-5 animate-spin text-slate-400" />
            </div>
         ) : (
            <div className="max-h-[520px] overflow-y-auto rounded-lg border bg-white">
               {/* Templates in collection */}
               {inCollection.length > 0 && (
                  <div>
                     <div className="sticky top-0 border-b bg-slate-50 px-3 py-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                        In dieser Sammlung ({inCollection.length})
                     </div>
                     {inCollection.map((t) => renderRow(t, true))}
                  </div>
               )}

               {/* Templates not in collection */}
               {notInCollection.length > 0 && (
                  <div>
                     <div className="sticky top-0 border-b bg-slate-50 px-3 py-2 text-xs font-semibold tracking-wide text-slate-400 uppercase">
                        Weitere Vorlagen
                     </div>
                     {notInCollection.map((t) => renderRow(t, false))}
                  </div>
               )}

               {allTemplates.length === 0 && !isFetching && (
                  <div className="py-12 text-center text-sm text-slate-400">
                     Keine Vorlagen gefunden
                  </div>
               )}

               {/* Load more */}
               {hasNextPage && (
                  <div className="border-t p-3">
                     <Button
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => fetchNextPage()}
                        disabled={isFetching}
                     >
                        {isFetching ? (
                           <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                           "Mehr laden"
                        )}
                     </Button>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};
