import { Metadata } from "next";

import { CollectionNew } from "@/components/collections/collection-new";

export const metadata: Metadata = {
   title: "Neue Sammlung",
};

const NewCollectionPage = () => {
   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="new-collection-page"
      >
         <CollectionNew />
      </div>
   );
};

export default NewCollectionPage;
