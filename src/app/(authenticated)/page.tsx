import { redirect } from "next/navigation";

const MainPage = async () => {
   return redirect("/library");
};

export default MainPage;
