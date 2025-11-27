import { Metadata } from "next";

export const metadata: Metadata = {
   title: "Home",
};

const MainPage = async () => {
   return (
      <div className="h-screen flex flex-center" data-testid="main-page">
         main page
      </div>
   );
};

export default MainPage;
