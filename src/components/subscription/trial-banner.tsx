"use client";

import { useState } from "react";
import { X } from "lucide-react";
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

   return (
      <div
         className={cn(
            "flex items-center justify-between gap-4 px-4 py-2 text-sm",
            isUrgent
               ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
               : "bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
         )}
         data-testid="trial-banner"
         role="status"
         aria-live="polite"
      >
         <span>
            {daysLeft === 0
               ? "Dein Trial endet heute – danach gelten die Free-Tier Limits."
               : `Noch ${daysLeft} ${daysLeft === 1 ? "Tag" : "Tage"} Trial – danach gelten die Free-Tier Limits.`}
         </span>

         <div className="flex shrink-0 items-center gap-3">
            <Link
               href="/subscription/pricing"
               className={cn(
                  "rounded px-3 py-1 text-xs font-medium transition-colors",
                  isUrgent
                     ? "bg-orange-600 text-white hover:bg-orange-700"
                     : "bg-blue-600 text-white hover:bg-blue-700"
               )}
               data-testid="subcription-link"
            >
               Jetzt upgraden
            </Link>

            <button
               onClick={() => setDismissed(true)}
               aria-label="Banner schließen"
               className="rounded p-1 opacity-70 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-current focus-visible:outline-none"
               data-testid="dismiss-btn"
            >
               <X className="h-4 w-4" />
            </button>
         </div>
      </div>
   );
};
