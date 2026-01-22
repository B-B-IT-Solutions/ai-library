import { auth } from "@/auth";
import { getUserById } from "@/data/actions/user";

import { SettingsContent } from "./settings";

export const metadata = {
   title: "Einstellungen",
};

const SettingsPage = async () => {
   const session = await auth();
   if (!session?.user?.id) {
      throw new Error("Nicht authentifiziert");
   }

   const user = await getUserById(session.user.id);

   return <SettingsContent user={user} />;
};

export default SettingsPage;
