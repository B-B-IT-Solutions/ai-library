import { redirect } from "next/navigation";

import { auth } from "@/auth";

const SettingsPage = async () => {
   const session = await auth();
   if (!session?.user?.id) {
      return redirect("/");
   }

   return redirect("/settings/general");
};

export default SettingsPage;
