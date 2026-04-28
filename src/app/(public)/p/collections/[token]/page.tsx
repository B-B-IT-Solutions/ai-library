import { Metadata } from "next";
import { notFound } from "next/navigation";

import { PublicCollectionView } from "@/components/collections";
import { getCollectionByPublicToken } from "@/data/actions/collection";

export const generateMetadata = async ({
   params,
}: PageProps): Promise<Metadata> => {
   const { token } = await params;
   const collection = await getCollectionByPublicToken(token);
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
   const collection = await getCollectionByPublicToken(token);

   if (!collection) {
      return notFound();
   }

   return (
      <div
         className="min-h-full bg-slate-50"
         data-testid="public-collection-page"
      >
         <PublicCollectionView collection={collection} />
      </div>
   );
};

export default PublicCollectionPage;
