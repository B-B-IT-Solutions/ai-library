import { Lock, Palette, Trash2, User } from "lucide-react";

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

   const sections = [
      { id: "profile", label: "Profil", icon: User },
      { id: "security", label: "Sicherheit", icon: Lock },
      { id: "appearance", label: "Erscheinungsbild", icon: Palette },
      { id: "danger", label: "Gefahrenbereich", icon: Trash2 },
   ];

   return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20" data-testid="settings-page">
         <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-12">
               <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                  Einstellungen
               </h1>
               <p className="text-lg text-muted-foreground">
                  Verwalten Sie Ihre Kontoeinstellungen und Präferenzen
               </p>
            </div>

            {/* Layout with Sidebar Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
               {/* Sidebar Navigation */}
               <aside className="lg:col-span-3">
                  <nav className="sticky top-8 space-y-1 bg-card rounded-lg border p-4 shadow-sm">
                     <h2 className="px-3 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Navigation
                     </h2>
                     {sections.map((section) => {
                        const Icon = section.icon;
                        return (
                           <a
                              key={section.id}
                              href={`#${section.id}`}
                              className="flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground group"
                           >
                              <Icon className="h-4 w-4 text-muted-foreground group-hover:text-accent-foreground" />
                              <span>{section.label}</span>
                           </a>
                        );
                     })}
                  </nav>
               </aside>

               {/* Main Content */}
               <main className="lg:col-span-9">
                  <div className="space-y-8">
                     <div id="profile">
                        <ProfileSection user={user} />
                     </div>
                     <div id="security">
                        <SecuritySection />
                     </div>
                     <div id="appearance">
                        <AppearanceSection />
                     </div>
                     <div id="danger">
                        <DangerZoneSection />
                     </div>
                  </div>
               </main>
            </div>
         </div>
      </div>
   );
};

export default SettingsPage;
