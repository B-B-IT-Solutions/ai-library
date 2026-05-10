import { Metadata } from "next";
import { notFound } from "next/navigation";

import { CollectionViewPublic } from "@/components/collections";
import { getPublicCollectionByToken } from "@/data/actions/collection";

export const generateMetadata = async ({
   params,
}: PageProps): Promise<Metadata> => {
   const { token } = await params;

   const collection = await getPublicCollectionByToken(token);
   if (!collection) {
      return {
         title: "Sammlung nicht gefunden",
      };
   }
   return {
      title: `${collection.name} - Sammlung`,
      description: collection.description,
   };
};

export type PageParams = {
   token: string;
};

export type PageProps = {
   params: Promise<PageParams>;
};

export const PublicCollectionPage = async ({ params }: PageProps) => {
   const { token } = await params;
   const collection = await getPublicCollectionByToken(token);

   if (!collection) {
      return notFound();
   }

   return (
      <div data-testid="public-collection-page">
         <CollectionViewPublic collection={collection} />
      </div>
   );
};

export default PublicCollectionPage;
