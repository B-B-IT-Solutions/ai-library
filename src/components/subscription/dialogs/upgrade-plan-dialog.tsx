"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
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
         <DialogContent data-testid="upgrade-plan-dialog">
            <DialogHeader>
               <div className="mb-2 flex justify-center" aria-hidden>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                     <Zap className="h-6 w-6 text-primary" />
                  </div>
               </div>
               <DialogTitle className="text-center">
                  Plan-Upgrade erforderlich
               </DialogTitle>
               <DialogDescription className="text-center">
                  Du hast dein Limit für{" "}
                  <span className="font-medium text-foreground">{feature}</span>{" "}
                  erreicht. Upgrade deinen Plan um mehr erstellen zu können.
               </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-2 sm:flex-col sm:gap-2">
               <Button asChild={true} className="w-full gap-2">
                  <Link href="/subscription/pricing" data-testid="upgrade-btn">
                     <Zap className="h-4 w-4" />
                     Plan upgraden
                  </Link>
               </Button>
               <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() => onOpenChange(false)}
                  data-testid="cancel-btn"
               >
                  Abbrechen
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
