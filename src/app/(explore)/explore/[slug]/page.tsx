import { filter } from "es-toolkit/compat";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CatalogEntryView } from "@/components/explore";
import { isAuthenticated } from "@/data/actions/auth-utils";
import {
   getPublishedCatalogEntriesPage,
   getPublishedCatalogEntryBySlug,
} from "@/data/actions/catalog";
import { DCatalogEntry } from "@/data/types/domain/catalog";

export const revalidate = 3600;

export const generateMetadata = async ({
   params,
}: PageProps): Promise<Metadata> => {
   const { slug } = await params;
   const entry = await getPublishedCatalogEntryBySlug(slug);

   if (!entry) {
      return { title: "Vorlage nicht gefunden" };
   }

   return {
      title: entry.title,
      description: entry.description,
      openGraph: {
         title: entry.title,
         description: entry.description,
      },
   };
};

export type PageParams = {
   slug: string;
};

export type PageProps = {
   params: Promise<PageParams>;
};

export const CatalogEntryPage = async ({ params }: PageProps) => {
   const { slug } = await params;

   const [entry, authenticated] = await Promise.all([
      getPublishedCatalogEntryBySlug(slug),
      isAuthenticated(),
   ]);

   if (!entry) {
      return notFound();
   }

   let relatedEntries: DCatalogEntry[] = [];

   if (entry.category) {
      const relatedPage = await getPublishedCatalogEntriesPage({
         pagination: { pageNumber: 0, pageSize: 4 },
         filter: { categories: [entry.category.slug] },
      });
      relatedEntries = filter(relatedPage.content, (e) => e.id !== entry.id);
   }

   return (
      <div
         className="mx-auto max-w-7xl px-4 py-8 sm:px-6"
         data-testid="catalog-entry-page"
      >
         {/* Breadcrumb */}
         <Link
            href="/explore"
            className="mb-6 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
         >
            <ChevronLeft className="h-4 w-4" />
            Zurück zur Übersicht
         </Link>

         <CatalogEntryView
            entry={entry}
            isAuthenticated={authenticated}
            relatedEntries={relatedEntries}
         />
      </div>
   );
};

export default CatalogEntryPage;
