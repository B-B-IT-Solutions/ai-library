"use client";

import { FC, Suspense, useState } from "react";

import { DUser } from "@/data/types/domain/user";
import { cn } from "@/lib/utils";

import { AccountSettings } from "./account";
import { GeneralSettings } from "./general";
import { Subscription } from "./subscription";

type TabId = "general" | "account" | "subscription";

type TabEntry = {
   id: TabId;
   label: string;
};

type SettingsProps = {
   user: DUser;
};

export const Settings: FC<SettingsProps> = ({ user }) => {
   const [activeTab, setActiveTab] = useState<TabId>("general");

   const entries: TabEntry[] = [
      { id: "general" as TabId, label: "Allgemein" },
      { id: "account" as TabId, label: "Konto" },
      { id: "subscription" as TabId, label: "Abrechnung" },
   ];

   const tab = (entry: TabEntry) => {
      const isActive = activeTab === entry.id;
      const styles = isActive
         ? "bg-primary text-primary-foreground shadow-sm"
         : "hover:bg-accent hover:text-accent-foreground";
      return (
         <button
            key={entry.id}
            onClick={() => setActiveTab(entry.id)}
            className={cn(
               "flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm transition-all",
               styles
            )}
            data-testid={`${entry.id}-tab`}
         >
            <span className="font-medium">{entry.label}</span>
         </button>
      );
   };

   const tabs = () => {
      return (
         <aside className="lg:col-span-3" data-testid="tabs">
            <nav className="sticky top-8 space-y-1 rounded-lg border bg-card p-4 shadow-sm">
               <h2 className="mb-3 px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                  Navigation
               </h2>
               {entries.map((entry) => tab(entry))}
            </nav>
         </aside>
      );
   };

   console.log("settings");

   const tabContent = () => {
      return (
         <main className="lg:col-span-9">
            <div className="animate-in duration-300 fade-in-50">
               {activeTab === "general" && <GeneralSettings user={user} />}
               {activeTab === "account" && <AccountSettings />}
               {activeTab === "subscription" && (
                  <Suspense fallback={<p>Loading feed...</p>}>
                     {/* <Subscription /> */}
                  </Suspense>
               )}
            </div>
         </main>
      );
   };

   return (
      <div
         className="grid grid-cols-1 gap-8 lg:grid-cols-12"
         data-testid="settings-view"
      >
         {tabs()}
         {tabContent()}
      </div>
   );
};
