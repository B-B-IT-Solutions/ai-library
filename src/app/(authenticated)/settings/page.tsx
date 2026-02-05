import { redirect } from "next/navigation";

const SettingsPage = async () => {
   return redirect("/settings/general");
};

export default SettingsPage;
