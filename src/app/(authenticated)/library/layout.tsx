import { ReactNode } from "react";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import {
   infiniteLoadLibraryEntriesOptions,
   preloadLibraryCategoriesOptions,
   preloadLibraryCollectionsOptions,
   preloadLibraryModelsOptions,
} from "@/data/ts-queries/library";
import { LibrarySidebar } from "@/components/library/sidebar/library-sidebar";

type LibraryLayoutProps = {
   children: ReactNode;
};

export default async function LibraryLayout({ children }: LibraryLayoutProps) {
   const queryClient = new QueryClient();

   // Prefetch all necessary data for optimal performance
   await Promise.all([
      queryClient.prefetchInfiniteQuery(infiniteLoadLibraryEntriesOptions({})),
      queryClient.prefetchQuery(preloadLibraryCategoriesOptions()),
      queryClient.prefetchQuery(preloadLibraryModelsOptions()),
      queryClient.prefetchQuery(preloadLibraryCollectionsOptions()),
   ]);

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div className="h-full flex">
            <LibrarySidebar />
            <div className="flex-1 overflow-hidden">{children}</div>
         </div>
      </HydrationBoundary>
   );
}
