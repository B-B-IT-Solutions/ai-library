import { Metadata } from "next";
import { SearchParams } from "nuqs/server";

import { CollectionDashboard } from "@/components/collections/collection-dashboard";
import { templatesSearchParamsCache } from "@/components/templates/search-params";

export const metadata: Metadata = {
   title: "Sammlung",
};

type PageProps = {
   params: Promise<{ id: string }>;
   searchParams: Promise<SearchParams>;
};

const CollectionPage = async ({ params, searchParams }: PageProps) => {
   const { id } = await params;
   await templatesSearchParamsCache.parse(searchParams);

   return (
      <div data-testid="collection-page" className="h-full">
         <CollectionDashboard collectionId={id} />
      </div>
   );
};

export default CollectionPage;
