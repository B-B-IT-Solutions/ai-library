import { Metadata } from "next";

export const metadata: Metadata = {
   title: "",
};

const PublicPage = async () => {
   return (
      <div className="h-full flex flex-center" data-testid="public-page">
         public page
      </div>
   );
};

export default PublicPage;
