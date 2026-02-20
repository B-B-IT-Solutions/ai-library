import { Metadata } from "next";

import { LibraryDashboard } from "@/components/library";
import { DListGroupByMode, DListViewMode } from "@/data/types/domain/common";

export const metadata: Metadata = {
   title: "Meine Vorlagen",
};

export type PageSearchParams = {
   view?: DListViewMode;
   group?: DListGroupByMode;
};

export type PageProps = {
   searchParams?: Promise<PageSearchParams>;
};

export const LibraryPage = async (props: PageProps) => {
   const searchParams = await props.searchParams;
   const { view: viewMode, group: groupBy } = searchParams || {};

   return (
      <div data-testid="library-page" className="h-full">
         <LibraryDashboard viewMode={viewMode} groupBy={groupBy} />
      </div>
   );
};

export default LibraryPage;
