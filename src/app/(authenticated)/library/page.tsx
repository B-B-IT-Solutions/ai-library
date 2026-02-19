import { Metadata } from "next";

import { LibraryDashboard } from "@/components/library";

export const metadata: Metadata = {
   title: "Meine Vorlagen",
};

export const LibraryPage = () => {
   return (
      <div data-testid="library-page" className="h-full">
         <LibraryDashboard />
      </div>
   );
};

export default LibraryPage;
