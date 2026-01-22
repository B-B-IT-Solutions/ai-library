"use client";

import { useState } from "react";
import { Lock, Palette, Trash2, User } from "lucide-react";

import { User as UserType } from "@/generated/prisma/client";

import {
   AppearanceSection,
   DangerZoneSection,
   ProfileSection,
   SecuritySection,
} from "./components";

type SettingsContentProps = {
   user: UserType;
};

type TabId = "profile" | "security" | "appearance" | "danger";

export const SettingsContent = ({ user }: SettingsContentProps) => {
   const [activeTab, setActiveTab] = useState<TabId>("profile");

   const sections = [
      { id: "profile" as TabId, label: "Profil", icon: User },
      { id: "security" as TabId, label: "Sicherheit", icon: Lock },
      { id: "appearance" as TabId, label: "Erscheinungsbild", icon: Palette },
      { id: "danger" as TabId, label: "Gefahrenbereich", icon: Trash2 },
   ];

   return (
      <div
         className="min-h-screen bg-gradient-to-b from-background to-muted/20"
         data-testid="settings"
      >
         <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Einstellungen
               </h1>
               <p className="text-slate-600">
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
         </div>
      </div>
   );
};
