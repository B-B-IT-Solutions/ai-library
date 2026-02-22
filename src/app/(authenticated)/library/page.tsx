import { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import {
   LibraryDashboard,
   librarySearchParamsCache,
} from "@/components/library";

export const metadata: Metadata = {
   title: "Meine Vorlagen",
};

export type PageProps = {
   searchParams: Promise<SearchParams>;
};

export const LibraryPage = async (props: PageProps) => {
   await librarySearchParamsCache.parse(props.searchParams);

   return (
      <div data-testid="library-page" className="h-full">
         <LibraryDashboard />
      </div>
   );
};

export default LibraryPage;
