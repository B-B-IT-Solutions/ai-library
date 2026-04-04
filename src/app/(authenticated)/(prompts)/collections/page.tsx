import { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import {
   CollectionsDashboard,
   collectionsSearchParamsCache,
} from "@/components/collections";

export const metadata: Metadata = {
   title: "Sammlungen",
};

export type PageProps = {
   searchParams: Promise<SearchParams>;
};

export const CollectionsPage = async (props: PageProps) => {
   await collectionsSearchParamsCache.parse(props.searchParams);

   return (
      <div data-testid="collections-page" className="h-full">
         <CollectionsDashboard />
      </div>
   );
};

export default CollectionsPage;
