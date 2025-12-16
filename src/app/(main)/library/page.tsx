"use client";

import { map } from "es-toolkit/compat";
import { BookOpen } from "lucide-react";
import Link from "next/link";

import { PurchasedTemplateCard } from "@/components/library/purchased-template-card";
import { Button } from "@/components/shadcn/button";
import {
   useLoadActiveSubscription,
   useLoadPurchasedTemplates,
} from "@/data/ts-queries/library/library";

export default function LibraryPage() {
   const { data: templates, isLoading: templatesLoading } =
      useLoadPurchasedTemplates();
   const { data: subscription } = useLoadActiveSubscription();

   if (templatesLoading) {
      return (
         <div className="container mx-auto px-4 py-8">
            <div className="animate-pulse">
               <div className="h-8 bg-slate-200 rounded w-48 mb-8" />
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                     <div key={i} className="h-64 bg-slate-100 rounded-lg" />
                  ))}
               </div>
            </div>
         </div>
      );
   }

   if (!templates || templates.length === 0) {
      return (
         <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">
               My Library
            </h1>
            <div className="text-center py-12">
               <BookOpen className="w-16 h-16 mx-auto text-slate-300 mb-4" />
               <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Your library is empty
               </h2>
               <p className="text-slate-600 mb-6">
                  Purchase templates or subscribe to access your library
               </p>
               <Link href="/marketplace">
                  <Button>Browse Marketplace</Button>
               </Link>
            </div>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8">
         <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
               My Library
            </h1>
            <p className="text-slate-600">
               Access and manage your purchased templates
            </p>
         </div>

         {subscription && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="font-semibold text-green-900">
                        Active Subscription
                     </h3>
                     <p className="text-sm text-green-700">
                        Access to all templates until{" "}
                        {new Date(subscription.endDate).toLocaleDateString()}
                     </p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded border border-green-200 text-sm font-medium">
                     Active
                  </span>
               </div>
            </div>
         )}

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {map(templates, (template) => (
               <PurchasedTemplateCard key={template.id} template={template} />
            ))}
         </div>
      </div>
   );
}
