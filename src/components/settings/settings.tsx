"use client";

import { FC, useState } from "react";
import { Lock, Palette, Trash2, User } from "lucide-react";

import { DUser } from "@/data/types/domain/user";

import {
   AppearanceSection,
   DangerZoneSection,
   ProfileSection,
   SecuritySection,
} from "./components";

type SettingsContentProps = {
   user: DUser;
};

type TabId = "profile" | "security" | "appearance" | "danger";

export const SettingsView: FC<SettingsContentProps> = ({ user }) => {
   const [activeTab, setActiveTab] = useState<TabId>("profile");

   const sections = [
      { id: "profile" as TabId, label: "Profil", icon: User },
      { id: "security" as TabId, label: "Sicherheit", icon: Lock },
      { id: "appearance" as TabId, label: "Erscheinungsbild", icon: Palette },
      { id: "danger" as TabId, label: "Gefahrenbereich", icon: Trash2 },
   ];

   return (
      <div
         className="grid grid-cols-1 lg:grid-cols-12 gap-8"
         data-testid="settings-view"
      >
         {/* Sidebar Navigation */}
         <aside className="lg:col-span-3">
            <nav className="sticky top-8 space-y-1 bg-card rounded-lg border p-4 shadow-sm">
               <h2 className="px-3 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Navigation
               </h2>
               {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeTab === section.id;
                  return (
                     <button
                        key={section.id}
                        onClick={() => setActiveTab(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all cursor-pointer ${
                           isActive
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "hover:bg-accent hover:text-accent-foreground"
                        }`}
                     >
                        <Icon
                           className={`h-4 w-4 ${
                              isActive
                                 ? "text-primary-foreground"
                                 : "text-muted-foreground"
                           }`}
                        />
                        <span className="font-medium">{section.label}</span>
                     </button>
                  );
               })}
            </nav>
         </aside>

         {/* Main Content */}
         <main className="lg:col-span-9">
            <div className="animate-in fade-in-50 duration-300">
               {activeTab === "profile" && <ProfileSection user={user} />}
               {activeTab === "security" && <SecuritySection />}
               {activeTab === "appearance" && <AppearanceSection />}
               {activeTab === "danger" && <DangerZoneSection />}
            </div>
         </main>
      </div>
   );
};
