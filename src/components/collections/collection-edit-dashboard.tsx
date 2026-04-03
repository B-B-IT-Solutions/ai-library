import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";
import { ArrowLeft, Folder } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getLibraryCollectionById } from "@/data/actions/library";
import { preloadLibraryCollectionsOptions } from "@/data/ts-queries/library";
import { libraryKeys } from "@/data/ts-queries/library/utils";

import { CollectionTemplateManager } from "@/components/collections/collection-template-manager";
import { EditCollectionForm } from "@/components/collections/edit-collection-form";

type Props = {
   collectionId: string;
};

export const CollectionEditDashboard = async ({ collectionId }: Props) => {
   const collection = await getLibraryCollectionById(collectionId);
   if (!collection) notFound();

   const queryClient = new QueryClient();
   await queryClient.prefetchQuery(preloadLibraryCollectionsOptions());
   queryClient.setQueryData(libraryKeys.collection(collectionId), collection);

   const iconColor = collection.color ?? "#64748b";

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div
            className="flex h-full flex-col bg-slate-50"
            data-testid="collection-edit-dashboard"
         >
            {/* Header */}
            <div className="border-b bg-white px-6 py-4">
               <div className="flex items-center gap-4">
                  <Link
                     href={`/collections/${collectionId}`}
                     className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900"
                  >
                     <ArrowLeft className="h-4 w-4" />
                     Zurück
                  </Link>
                  <div className="flex items-center gap-2.5">
                     <div
                        className="flex h-7 w-7 items-center justify-center rounded-md"
                        style={{ backgroundColor: `${iconColor}20` }}
                     >
                        <Folder
                           className="h-4 w-4"
                           style={{ color: iconColor }}
                        />
                     </div>
                     <span className="font-semibold text-slate-900">
                        {collection.name}
                     </span>
                     <span className="text-sm text-slate-400">bearbeiten</span>
                  </div>
               </div>
            </div>

            {/* Two-column layout */}
            <div className="flex-1 overflow-y-auto p-6">
               <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[340px_1fr]">
                  {/* Left: Collection Details + Sharing */}
                  <div className="space-y-4">
                     <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <h2 className="mb-4 font-semibold text-slate-800">
                           Sammlung
                        </h2>
                        <EditCollectionForm collection={collection} />
                     </div>
                  </div>

                  {/* Right: Template Management */}
                  <div className="rounded-xl border bg-white p-6 shadow-sm">
                     <div className="mb-4 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-800">
                           Vorlagen verwalten
                        </h2>
                        <span className="text-sm text-slate-400">
                           {collection.templateCount}{" "}
                           {collection.templateCount === 1
                              ? "Vorlage"
                              : "Vorlagen"}
                        </span>
                     </div>
                     <CollectionTemplateManager collectionId={collectionId} />
                  </div>
               </div>
            </div>
         </div>
      </HydrationBoundary>
   );
};
