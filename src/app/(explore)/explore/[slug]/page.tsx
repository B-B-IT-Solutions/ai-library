import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ExploreEntryDetail } from "@/components/explore";
import { isAuthenticated } from "@/data/actions/auth-utils";
import {
   getPublishedCatalogEntriesPage,
   getPublishedCatalogEntryBySlug,
} from "@/data/actions/catalog";

export const revalidate = 3600;

export type PageParams = {
   slug: string;
};

export type PageProps = {
   params: Promise<PageParams>;
};

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

const ExploreCatalogEntryPage = async ({ params }: PageProps) => {
   const { slug } = await params;

   const [entry, authenticated] = await Promise.all([
      getPublishedCatalogEntryBySlug(slug),
      isAuthenticated(),
   ]);

   if (!entry) {
      return notFound();
   }

   // Load related entries from the same category (exclude current)
   let relatedEntries: Array<{
      id: string;
      slug: string;
      title: string;
      description: string;
   }> = [];

   if (entry.category) {
      const relatedPage = await getPublishedCatalogEntriesPage({
         pagination: { pageNumber: 0, pageSize: 4 },
         filter: { categorySlug: entry.category.slug },
      });
      relatedEntries = relatedPage.content
         .filter((e) => e.id !== entry.id)
         .slice(0, 3)
         .map((e) => ({
            id: e.id,
            slug: e.slug,
            title: e.title,
            description: e.description,
         }));
   }

   return (
      <div
         className="mx-auto max-w-7xl px-4 py-8 sm:px-6"
         data-testid="explore-entry-page"
      >
         {/* Breadcrumb */}
         <Link
            href="/explore"
            className="mb-6 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
         >
            <ChevronLeft className="h-4 w-4" />
            Zurück zur Übersicht
         </Link>

         <ExploreEntryDetail
            entry={entry}
            isAuthenticated={authenticated}
            relatedEntries={relatedEntries}
         />
      </div>
   );
};

export default ExploreCatalogEntryPage;
