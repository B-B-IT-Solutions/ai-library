import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SettingsContent } from "@/components/settings";
import { getUserById } from "@/data/actions/user";

export const metadata = {
   title: "Einstellungen",
};

const SettingsPage = async () => {
   const session = await auth();
   if (!session?.user?.id) {
      return redirect("/");
   }

   const user = await getUserById(session.user.id);

   return (
      <div
         className="container min-h-screen mx-auto px-4 py-8 max-w-7xl "
         data-testid="settings-page"
      >
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
               Einstellungen
            </h1>
            <p className="text-slate-600">
               Verwalten Sie Ihre Kontoeinstellungen und Präferenzen
            </p>
         </div>
         <SettingsContent user={user} />
      </div>
   );
};

export default SettingsPage;
