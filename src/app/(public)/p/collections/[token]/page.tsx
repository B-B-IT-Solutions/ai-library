import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PublicCollectionView } from "@/components/collections";
import { Button } from "@/components/shadcn/button";
import { getCollectionByPublicToken } from "@/data/actions/collection";
import { APP_NAME } from "@/lib/constants";

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

         {/* CTA */}
         <div className="mx-auto max-w-5xl px-6 py-8">
            <div className="mt-12 rounded-xl border bg-white p-8 text-center shadow-sm">
               <h2 className="mb-2 text-xl font-bold text-slate-900">
                  Vorlagen mit {APP_NAME} nutzen
               </h2>
               <p className="mb-6 text-slate-500">
                  Erstellen Sie ein kostenloses Konto, um diese und weitere
                  Vorlagen zu verwenden, zu bearbeiten und eigene Sammlungen
                  anzulegen.
               </p>
               <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg">
                     <Link href="/auth/sign-up">Kostenlos registrieren</Link>
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
};

export default PublicCollectionPage;
