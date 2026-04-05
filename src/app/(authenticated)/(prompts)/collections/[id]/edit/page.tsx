import { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionEdit } from "@/components/collections";
import { getCollectionById } from "@/data/actions/collection";

export const metadata: Metadata = {
   title: "Sammlung Bearbeiten",
};

export type PageParams = {
   id: string;
};

export type PageProps = {
   params: Promise<PageParams>;
};

export const CollectionEditPage = async ({ params }: PageProps) => {
   const { id: collectionId } = await params;

   const collection = await getCollectionById(collectionId);

   if (!collection) {
      return notFound();
   }

   return (
      <div data-testid="collection-edit-page" className="h-full">
         <CollectionEdit collection={collection} />
      </div>
   );
};

export default CollectionEditPage;
