import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";

import { infiniteLoadPromptsOptions } from "@/data/ts-queries/prompt/prompt";

import { CreatePromptButton } from "./buttons";

export const PromptsDashboard = async () => {
   const queryClient = new QueryClient();

   await Promise.all([
      queryClient.prefetchInfiniteQuery(infiniteLoadPromptsOptions({})),
   ]);

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div
            className="flex h-full flex-col bg-slate-50"
            data-testid="prompts-dashboard"
         >
            <div className="space-y-4 border-b bg-white px-6 py-4">
               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="text-2xl font-bold text-slate-900">
                        Meine Prompts
                     </h1>
                     <p className="mt-1 text-sm text-slate-600">
                        Verwalten Sie Ihre gespeicherten Prompts
                     </p>
                  </div>
                  <div className="flex items-center gap-3">
                     <CreatePromptButton />
                  </div>
               </div>

               {/* <CollectionsFilter filters={filters} /> */}
            </div>

            {/* <LibraryToolbar
               viewMode={viewMode}
               filters={filters}
               categories={categories}
               models={models}
            /> */}

            <div className="flex-1 overflow-y-auto">
               {/* <LibraryEntries
                  viewMode={viewMode}
                  groupBy={groupBy}
                  sortBy={sortBy}
                  filters={filters}
               /> */}
            </div>
         </div>
      </HydrationBoundary>
   );
};
