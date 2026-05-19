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
         <DialogContent
            className="overflow-hidden p-0"
            data-testid="upgrade-plan-dialog"
         >
            {/* Farbiger Header-Bereich */}
            <div className="bg-linear-to-br from-primary to-primary/70 px-6 pt-8 pb-8 text-primary-foreground">
               <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 ring-4 ring-white/10">
                  <Zap className="h-8 w-8" />
               </div>
               <DialogHeader>
                  <DialogTitle className="text-center text-xl text-primary-foreground">
                     Plan-Upgrade erforderlich
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-center text-primary-foreground/80">
                     Du hast dein Limit für{" "}
                     <span className="font-semibold text-primary-foreground">
                        {feature}
                     </span>{" "}
                     erreicht.
                  </DialogDescription>
               </DialogHeader>
            </div>

            {/* Inhalt */}
            <div className="px-6 py-5">
               <p className="mb-5 text-center text-sm text-muted-foreground">
                  Mit einem Upgrade bekommst du mehr{" "}
                  <span className="font-medium text-foreground">{feature}</span>
                  , erweiterte Funktionen und unbegrenzte Möglichkeiten.
               </p>

               <DialogFooter className="flex-col gap-2 sm:flex-col">
                  <Button
                     asChild={true}
                     className="w-full gap-2 font-semibold"
                     size="lg"
                  >
                     <Link
                        href="/subscription/pricing"
                        data-testid="upgrade-btn"
                     >
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
            </div>
         </DialogContent>
      </Dialog>
   );
};
