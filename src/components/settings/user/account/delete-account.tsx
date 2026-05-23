import { AlertTriangle } from "lucide-react";

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
               <DeleteAcountDialog canDelete={canDeleteAccount(subscription)} />
            </div>
         </CardContent>
      </Card>
   );
};
