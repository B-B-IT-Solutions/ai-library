import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { preloadLibraryCollectionsOptions } from "@/data/ts-queries/library";

import { CollectionItems } from "./lists";

export const CollectionsDashboard = async () => {
   const queryClient = new QueryClient();
   await queryClient.prefetchQuery(preloadLibraryCollectionsOptions());

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div
            className="flex h-full flex-col bg-slate-50"
            data-testid="collections-dashboard"
         >
            <div className="space-y-4 border-b bg-white px-6 py-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="text-2xl font-bold text-slate-900">
                        Sammlungen
                     </h1>
                     <p className="mt-1 text-sm text-slate-600">
                        Organisieren Sie Ihre Vorlagen in Sammlungen
                     </p>
                  </div>
                  <div className="flex items-center gap-3">
                     <Button asChild className="gap-2">
                        <Link href="/collections/new">
                           <Plus className="h-4 w-4" />
                           Neue Sammlung
                        </Link>
                     </Button>
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
               <CollectionItems />
            </div>
         </div>
      </HydrationBoundary>
   );
};
