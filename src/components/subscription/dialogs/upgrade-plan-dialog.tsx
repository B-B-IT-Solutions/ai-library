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
            <DialogHeader className="items-center gap-4">
               <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
                  <Zap className="h-8 w-8 text-primary" />
               </div>
               <div className="space-y-1.5 text-center">
                  <DialogTitle className="text-xl">
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
            </DialogHeader>

            <DialogFooter className="mt-2 flex-col gap-2 sm:flex-col">
               <Button
                  asChild={true}
                  className="w-full gap-2 font-semibold"
                  size="lg"
               >
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
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
};
