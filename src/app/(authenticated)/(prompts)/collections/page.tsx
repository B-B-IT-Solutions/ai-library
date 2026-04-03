import {
   dehydrate,
   HydrationBoundary,
   QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

import { CollectionsDashboard } from "@/components/collections/collections-dashboard";
import { preloadLibraryCollectionsOptions } from "@/data/ts-queries/library";

export const metadata: Metadata = {
   title: "Sammlungen",
};

const CollectionsPage = async () => {
   const queryClient = new QueryClient();
   await queryClient.prefetchQuery(preloadLibraryCollectionsOptions());

   return (
      <HydrationBoundary state={dehydrate(queryClient)}>
         <div data-testid="collections-page" className="h-full">
            <CollectionsDashboard />
         </div>
      </HydrationBoundary>
   );
};

export default CollectionsPage;
