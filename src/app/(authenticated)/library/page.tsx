import { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import {
   LibraryDashboard,
   loadLibrarySearchParams,
} from "@/components/library";

export const metadata: Metadata = {
   title: "Meine Vorlagen",
};

export type PageProps = {
   searchParams: Promise<SearchParams>;
};

export const LibraryPage = async (props: PageProps) => {
   const searchParams = await loadLibrarySearchParams(props.searchParams);
   const { view: viewMode, group: groupBy, sort: sortBy } = searchParams;

   return (
      <div data-testid="library-page" className="h-full">
         <LibraryDashboard
            viewMode={viewMode}
            groupBy={groupBy}
            sortBy={sortBy}
         />
      </div>
   );
};

export default LibraryPage;
