import { auth } from "@/auth";
import { getUserById } from "@/data/actions/user";

import {
   AppearanceSection,
   DangerZoneSection,
   ProfileSection,
   SecuritySection,
} from "./components";

export const metadata = {
   title: "Einstellungen",
};

const SettingsPage = async () => {
   const session = await auth();
   if (!session?.user?.id) {
      throw new Error("Nicht authentifiziert");
   }

   const user = await getUserById(session.user.id);

   return (
      <div className="container max-w-3xl py-8" data-testid="settings-page">
         <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Einstellungen</h1>
            <p className="text-muted-foreground">
               Verwalten Sie Ihre Kontoeinstellungen
            </p>
         </div>

         <div className="space-y-6">
            <ProfileSection user={user} />
            <SecuritySection />
            <AppearanceSection />
            <DangerZoneSection />
         </div>
      </div>
   );
};

export default SettingsPage;
