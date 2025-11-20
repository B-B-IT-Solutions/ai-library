"use client";

import { startsWith } from "es-toolkit/compat";
import { FileText, Settings, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
   const pathName = usePathname();

   const isActive = (path: string) => {
      return startsWith(pathName, path);
   };

   return (
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
         <div className="p-6 border-b border-slate-200">
            <h1 className="text-2xl font-bold text-slate-900">
               Prompt Manager
            </h1>
         </div>

         <nav className="flex-1 p-4">
            <Link
               href="/prompts"
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
                  isActive("/prompts")
                     ? "bg-blue-50 text-blue-700 font-medium"
                     : "text-slate-600 hover:bg-slate-50"
               }`}
            >
               <FileText className="w-5 h-5" />
               Prompts
            </Link>

            <Link
               href="/favorites"
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
                  isActive("/favorites")
                     ? "bg-blue-50 text-blue-700 font-medium"
                     : "text-slate-600 hover:bg-slate-50"
               }`}
            >
               <Star className="w-5 h-5" />
               Favorites
            </Link>

            <Link
               href="/settings"
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive("/settings")
                     ? "bg-blue-50 text-blue-700 font-medium"
                     : "text-slate-600 hover:bg-slate-50"
               }`}
            >
               <Settings className="w-5 h-5" />
               Settings
            </Link>
         </nav>

         <div className="p-4 border-t border-slate-200 text-xs text-slate-500">
            <p>Version 1.0.0</p>
         </div>
      </div>
   );
};
