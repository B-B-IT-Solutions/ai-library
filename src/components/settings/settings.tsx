"use client";

import { FC, useState } from "react";

import { DUser } from "@/data/types/domain/user";

import { AccountSettings } from "./account/account";
import { GeneralSettings } from "./general/general";

type SettingsProps = {
   user: DUser;
};

type TabId = "general" | "account";
type TabEntry = {
   id: TabId;
   label: string;
};

export const Settings: FC<SettingsProps> = ({ user }) => {
   const [activeTab, setActiveTab] = useState<TabId>("general");

   const sections: TabEntry[] = [
      { id: "general" as TabId, label: "Allgemein" },
      { id: "account" as TabId, label: "Konto" },
   ];

   const tab = (entry: TabEntry) => {
      const isActive = activeTab === entry.id;
      return (
         <button
            key={entry.id}
            onClick={() => setActiveTab(entry.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all cursor-pointer ${
               isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "hover:bg-accent hover:text-accent-foreground"
            }`}
         >
            <span className="font-medium">{entry.label}</span>
         </button>
      );
   };

   const tabs = () => {
      return (
         <aside className="lg:col-span-3">
            <nav className="sticky top-8 space-y-1 bg-card rounded-lg border p-4 shadow-sm">
               <h2 className="px-3 mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Navigation
               </h2>
               {sections.map((section) => {
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
                        <span className="font-medium">{section.label}</span>
                     </button>
                  );
               })}
            </nav>
         </aside>
      );
   };

   const tabContent = () => {
      return (
         <main className="lg:col-span-9">
            <div className="animate-in fade-in-50 duration-300">
               {activeTab === "general" && <GeneralSettings user={user} />}
               {activeTab === "account" && <AccountSettings />}
            </div>
         </main>
      );
   };

   return (
      <div
         className="grid grid-cols-1 lg:grid-cols-12 gap-8"
         data-testid="settings-view"
      >
         {tabs()}
         {tabContent()}
      </div>
   );
};
