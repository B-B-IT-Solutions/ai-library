import { Metadata } from "next";

import { CollectionEdit } from "@/components/collections";

export const metadata: Metadata = {
   title: "Neue Sammlung",
};

export const NewCollectionPage = async () => {
   return (
      <div
         className="flex h-screen flex-col bg-slate-50"
         data-testid="new-collection-page"
      >
         <CollectionEdit />
      </div>
   );
};

export default NewCollectionPage;
