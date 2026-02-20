import { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import {
   LibraryDashboard,
   loadLibrarySearchParams,
} from "@/components/library";
import { DLibraryEntriesFilter } from "@/data/types/domain/library";

export const metadata: Metadata = {
   title: "Meine Vorlagen",
};

export type PageProps = {
   searchParams: Promise<SearchParams>;
};

export const LibraryPage = async (props: PageProps) => {
   const searchParams = await loadLibrarySearchParams(props.searchParams);
   const { view, group, sort } = searchParams;
   const { f_search, f_categories, f_collectionIds, f_isFavorite, f_models } =
      searchParams;

   const filters: DLibraryEntriesFilter = {
      search: f_search,
      categories: f_categories,
      models: f_models,
      collectionIds: f_collectionIds,
      isFavorite: f_isFavorite,
   };

   return (
      <div data-testid="library-page" className="h-full">
         <LibraryDashboard
            viewMode={view}
            groupBy={group}
            sortBy={sort}
            filters={filters}
         />
      </div>
   );
};

export default LibraryPage;
