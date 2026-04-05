import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SearchParams } from "nuqs/server";

import { CollectionView } from "@/components/collections";
import { collectionsSearchParamsCache } from "@/components/collections";
import { getCollectionById } from "@/data/actions/collection";

export const metadata: Metadata = {
   title: "Sammlung",
};

export type PageParams = {
   id: string;
};

type PageProps = {
   params: Promise<PageParams>;
   searchParams: Promise<SearchParams>;
};

const CollectionPage = async ({ params, searchParams }: PageProps) => {
   const { id: collectionId } = await params;
   await collectionsSearchParamsCache.parse(searchParams);

   const collection = await getCollectionById(collectionId);

   if (!collection) {
      return notFound();
   }

   return (
      <div data-testid="collection-page" className="h-full">
         <CollectionView collection={collection} />
      </div>
   );
};

export default CollectionPage;
