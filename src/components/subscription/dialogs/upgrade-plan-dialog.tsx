"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogTitle,
} from "@/components/shadcn/dialog";

type Props = {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   feature: string;
};

export const UpgradePlanDialog = ({ open, onOpenChange, feature }: Props) => {
   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent
            className="max-w-sm"
            data-testid="upgrade-plan-dialog"
         >
            {/* Icon + Header */}
            <div className="flex flex-col items-center gap-4 pt-2 text-center">
               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 ring-4 ring-amber-50">
                  <Zap className="h-8 w-8 text-amber-600" />
               </div>
               <div className="space-y-1.5">
                  <DialogTitle className="text-xl font-bold">
                     Plan-Upgrade erforderlich
                  </DialogTitle>
                  <DialogDescription>
                     Du hast dein Limit für{" "}
                     <span className="font-semibold text-foreground">
                        {feature}
                     </span>{" "}
                     erreicht. Upgrade deinen Plan um mehr erstellen zu können.
                  </DialogDescription>
               </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 border-t pt-4">
               <Button asChild size="lg" className="w-full gap-2 font-semibold">
                  <Link href="/subscription/pricing" data-testid="upgrade-btn">
                     <Zap className="h-4 w-4" />
                     Jetzt upgraden
                  </Link>
               </Button>
               <Button
                  variant="ghost"
                  className="w-full cursor-pointer text-muted-foreground"
                  onClick={() => onOpenChange(false)}
                  data-testid="cancel-btn"
               >
                  Vielleicht später
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   );
};
