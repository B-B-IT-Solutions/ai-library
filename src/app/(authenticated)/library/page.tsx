import { Metadata } from "next";

import { LibraryDashboard } from "@/components/library";
import { DListViewMode } from "@/data/types/domain/common";

export const metadata: Metadata = {
   title: "Meine Vorlagen",
};

export type PageSearchParams = {
   view?: DListViewMode;
};

export type PageProps = {
   searchParams?: Promise<PageSearchParams>;
};

export const LibraryPage = async (props: PageProps) => {
   const searchParams = await props.searchParams;
   const viewMode = searchParams?.view;

   return (
      <div data-testid="library-page" className="h-full">
         <LibraryDashboard viewMode={viewMode} />
      </div>
   );
};

export default LibraryPage;
