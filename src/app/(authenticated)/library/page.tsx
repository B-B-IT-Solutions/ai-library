import { Metadata } from "next";

import {
   LibraryDashboard,
   loadLibrarySearchParams,
} from "@/components/library";
import {
   DListGroupByMode,
   DListSortByMode,
   DListViewMode,
} from "@/data/types/domain/common";

export const metadata: Metadata = {
   title: "Meine Vorlagen",
};

export type PageSearchParams = {
   view?: DListViewMode;
   group?: DListGroupByMode;
   sort?: DListSortByMode;
};

export type PageProps = {
   searchParams?: Promise<PageSearchParams>;
};

export const LibraryPage = async (props: PageProps) => {
   const searchParams = await props.searchParams;
   const { view: viewMode, group: groupBy, sort: sortBy } = searchParams || {};

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
