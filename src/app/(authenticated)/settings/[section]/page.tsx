import { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Settings } from "@/components/settings";
import { getUserById } from "@/data/actions/user";
import { DSettingsSection } from "@/data/types/domain/settings";

export const metadata: Metadata = {
   title: "Einstellungen",
};

export type SettingsParams = {
   section: DSettingsSection;
};

export type SettingsPageProps = {
   params: Promise<SettingsParams>;
};

const SettingsPage = async (props: SettingsPageProps) => {
   const session = await auth();
   if (!session?.user?.id) {
      return redirect("/");
   }

   const { section } = await props.params;

   const user = await getUserById(session.user.id);

   return (
      <div
         className="container mx-auto min-h-screen max-w-7xl px-4 py-8"
         data-testid="settings-page"
      >
         <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
               Einstellungen
            </h1>
            <p className="text-slate-600">
               Verwalten Sie Ihre Kontoeinstellungen und Präferenzen
            </p>
         </div>

         <div className="space-y-6">
            <Settings user={user} section={section} />
         </div>
      </div>
   );
};

export default SettingsPage;
