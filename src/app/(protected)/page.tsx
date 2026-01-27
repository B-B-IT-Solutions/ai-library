import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Startseite",
};

const MainPage = async () => {
   return (
      <div className="flex-center flex h-full" data-testid="main-page">
         main page
      </div>
   );
};

export default MainPage;
