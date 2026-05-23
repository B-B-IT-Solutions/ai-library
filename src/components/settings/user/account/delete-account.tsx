import { AlertTriangle, Lock } from "lucide-react";

import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import { DSubscription } from "@/data/types/domain/subscription";

import { DeleteAcountDialog } from "./dialogs/delete-account-dialog";

type Props = {
   subscription: DSubscription | null;
};

export const DeleteAcount = ({ subscription }: Props) => {
   const canDeleteAccount = (subscription: DSubscription | null): boolean => {
      if (!subscription) {
         return true;
      }
      return subscription.status === "CANCELED";
   };

   const isDeletionAllowed = canDeleteAccount(subscription);

   const dialog = () => {
      return <DeleteAcountDialog />;
   };

   const blockedNotice = () => {
      return (
         <div
            className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950"
            data-testid="delete-blocked-notice"
         >
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
               Ihr Konto kann nicht gelöscht werden, solange ein aktives
               Abonnement besteht. Bitte kündigen Sie zuerst Ihr Abonnement.
            </p>
         </div>
      );
   };

   return (
      <Card className="border-destructive" data-testid="delete-account">
         <CardHeader>
            <div className="flex items-center gap-2">
               <AlertTriangle className="h-5 w-5 text-destructive" />
               <CardTitle className="text-destructive">
                  Gefahrenbereich
               </CardTitle>
            </div>
            <CardDescription>Dauerhafte Aktionen für Ihr Konto</CardDescription>
         </CardHeader>
         <CardContent>
            <div>
               <h3 className="mb-1 text-sm font-medium">Konto löschen</h3>
               <p className="mb-4 text-sm text-muted-foreground">
                  Löschen Sie Ihr Konto dauerhaft und alle zugehörigen Daten.
                  Diese Aktion kann nicht rückgängig gemacht werden.
               </p>
               {isDeletionAllowed ? dialog() : blockedNotice()}
            </div>
         </CardContent>
      </Card>
   );
};
