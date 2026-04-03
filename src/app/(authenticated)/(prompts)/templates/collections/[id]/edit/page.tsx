import { Metadata } from "next";

import { CollectionEditDashboard } from "@/components/templates/collection-edit-dashboard";

export const metadata: Metadata = {
   title: "Sammlung bearbeiten",
};

type PageProps = {
   params: Promise<{ id: string }>;
};

const CollectionEditPage = async ({ params }: PageProps) => {
   const { id } = await params;
   return (
      <div data-testid="collection-edit-page" className="h-full">
         <CollectionEditDashboard collectionId={id} />
      </div>
   );
};

export default CollectionEditPage;
