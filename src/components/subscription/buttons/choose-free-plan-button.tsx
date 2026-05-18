"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { chooseFreeplan } from "@/data/actions/subscription";

export const ChooseFreePlanButton = () => {
   const [isPending, startTransition] = useTransition();

   const handleChooseFree = () => {
      startTransition(async () => {
         const result = await chooseFreeplan();
         if (!result.success) {
            toast.error(result.message);
         }
      });
   };

   return (
      <Button
         variant="outline"
         onClick={handleChooseFree}
         disabled={isPending}
         className="w-full"
         data-testid="choose-free-plan-btn"
      >
         {isPending ? (
            <>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Wird geladen...
            </>
         ) : (
            "Kostenlos starten"
         )}
      </Button>
   );
};
