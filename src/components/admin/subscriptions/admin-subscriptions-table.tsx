import { format } from "date-fns";

import { Badge } from "@/components/shadcn/badge";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/shadcn/table";
import { DAdminSubscriptionsPage } from "@/data/types/domain/admin/admin";

type Props = {
   subscriptionsPage: DAdminSubscriptionsPage;
};

export const AdminSubscriptionsTable = ({ subscriptionsPage }: Props) => {
   return (
      <div data-testid="admin-subscriptions-table">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Nutzer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Interval</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Laufzeit bis</TableHead>
                  <TableHead>Kündigung</TableHead>
                  <TableHead>Erstellt</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {subscriptionsPage.content.map((sub) => (
                  <TableRow key={sub.id}>
                     <TableCell>
                        <div>
                           <p className="font-medium">{sub.userName}</p>
                           <p className="text-xs text-muted-foreground">
                              {sub.userEmail}
                           </p>
                        </div>
                     </TableCell>
                     <TableCell>
                        <div>
                           <p className="font-medium">{sub.planName}</p>
                           <p className="text-xs text-muted-foreground">
                              {sub.planTier}
                           </p>
                        </div>
                     </TableCell>
                     <TableCell>{sub.billingInterval}</TableCell>
                     <TableCell>
                        <Badge
                           variant={
                              sub.status === "ACTIVE" ? "default" : "secondary"
                           }
                        >
                           {sub.status}
                        </Badge>
                     </TableCell>
                     <TableCell>
                        {sub.currentPeriodEnd
                           ? format(
                                new Date(sub.currentPeriodEnd),
                                "dd.MM.yyyy"
                             )
                           : "—"}
                     </TableCell>
                     <TableCell>
                        {sub.cancelAtPeriodEnd ? (
                           <Badge variant="destructive">Ja</Badge>
                        ) : (
                           <Badge variant="secondary">Nein</Badge>
                        )}
                     </TableCell>
                     <TableCell>
                        {format(new Date(sub.createdAt), "dd.MM.yyyy")}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         <div className="mt-4 text-sm text-muted-foreground">
            {subscriptionsPage.numberOfElements} von{" "}
            {subscriptionsPage.totalElements} Abonnements
         </div>
      </div>
   );
};
