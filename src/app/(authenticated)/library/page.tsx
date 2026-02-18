import { Metadata } from "next";

import { LibraryDashboard } from "@/components/library/library-dashboard";

export const metadata: Metadata = {
   title: "Meine Bibliothek",
};

export const LibraryPage = () => {
   return (
      <div data-testid="library-page" className="h-full">
         <LibraryDashboard />
      </div>
   );
};

export default LibraryPage;
