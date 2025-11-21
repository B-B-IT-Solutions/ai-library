import { Favorites } from "./favorites";

export const metadata = {
   title: "Favorites",
};

const FavoritesPage = async () => {
   return (
      <div data-testid="favorites-page">
         <Favorites />
      </div>
   );
};

export default FavoritesPage;
