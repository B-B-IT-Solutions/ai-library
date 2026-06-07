"use client";

import { useState } from "react";
import { Clock, X } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

type Props = {
   daysLeft: number;
};

export const TrialBanner = ({ daysLeft }: Props) => {
   const [dismissed, setDismissed] = useState(false);

   if (dismissed) {
      return null;
   }

   const isUrgent = daysLeft <= 3;

   const message =
      daysLeft === 0 ? (
         <>
            Dein Trial endet <strong className="font-semibold">heute</strong> –
            danach gelten die Free-Tier Limits.
         </>
      ) : (
         <>
            Noch{" "}
            <strong className="font-semibold">
               {daysLeft} {daysLeft === 1 ? "Tag" : "Tage"}
            </strong>{" "}
            Trial – danach gelten die Free-Tier Limits.
         </>
      );

   return (
      <div
         className={cn(
            "flex items-center justify-between gap-4 border-b px-4 py-2.5 text-sm",
            isUrgent
               ? "border-orange-200 bg-orange-100 text-orange-800 dark:border-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
               : "border-blue-100 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
         )}
         data-testid="trial-banner"
         role="status"
         aria-live="polite"
      >
         <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 shrink-0" />
            <span>{message}</span>
         </div>

         <div className="flex shrink-0 items-center gap-2">
            <Link
               href="/subscription/pricing"
               className={cn(
                  "rounded-full px-4 py-1 text-xs font-semibold text-white transition-colors",
                  isUrgent
                     ? "bg-orange-600 hover:bg-orange-700"
                     : "bg-blue-700 hover:bg-blue-800"
               )}
               data-testid="subcription-link"
            >
               Jetzt upgraden
            </Link>

            <button
               onClick={() => setDismissed(true)}
               aria-label="Banner schließen"
               className="rounded-full p-1 opacity-60 transition-all hover:bg-black/5 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current focus-visible:outline-none"
               data-testid="dismiss-btn"
            >
               <X className="h-4 w-4" />
            </button>
         </div>
      </div>
   );
};
