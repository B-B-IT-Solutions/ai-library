import { Metadata } from "next";

import { CollectionsDashboard } from "@/components/collections";

export const metadata: Metadata = {
   title: "Sammlungen",
};

export const CollectionsPage = async () => {
   return (
      <div data-testid="collections-page" className="h-full">
         <CollectionsDashboard />
      </div>
   );
};

export default CollectionsPage;
