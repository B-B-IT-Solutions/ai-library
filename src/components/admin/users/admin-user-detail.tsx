import { format } from "date-fns";

import { Badge } from "@/components/shadcn/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/shadcn/table";
import { DAdminUserDetail } from "@/data/types/domain/admin";

import { AdminUserRoleForm } from "./admin-user-role-form";

type Props = {
   user: DAdminUserDetail;
};

export const AdminUserDetail = ({ user }: Props) => {
   return (
      <div className="space-y-6" data-testid="admin-user-detail">
         {/* User Info */}
         <Card>
            <CardHeader>
               <CardTitle>Nutzerinformationen</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
               <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="text-sm font-mono">{user.id}</p>
               </div>
               <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="text-sm">{user.name}</p>
               </div>
               <div>
                  <p className="text-sm font-medium text-muted-foreground">E-Mail</p>
                  <p className="text-sm">{user.email}</p>
               </div>
               <div>
                  <p className="text-sm font-medium text-muted-foreground">E-Mail verifiziert</p>
                  <p className="text-sm">
                     {user.emailVerified ? (
                        <Badge variant="default">Ja — {format(new Date(user.emailVerified), "dd.MM.yyyy")}</Badge>
                     ) : (
                        <Badge variant="destructive">Nein</Badge>
                     )}
                  </p>
               </div>
               <div>
                  <p className="text-sm font-medium text-muted-foreground">Stripe Customer ID</p>
                  <p className="text-sm font-mono">{user.stripeCustomerId ?? "—"}</p>
               </div>
               <div>
                  <p className="text-sm font-medium text-muted-foreground">Trial endet am</p>
                  <p className="text-sm">
                     {user.trialEndsAt
                        ? format(new Date(user.trialEndsAt), "dd.MM.yyyy")
                        : "—"}
                  </p>
               </div>
               <div>
                  <p className="text-sm font-medium text-muted-foreground">Erstellt</p>
                  <p className="text-sm">{format(new Date(user.createdAt), "dd.MM.yyyy HH:mm")}</p>
               </div>
               <div>
                  <p className="text-sm font-medium text-muted-foreground">Aktualisiert</p>
                  <p className="text-sm">{format(new Date(user.updatedAt), "dd.MM.yyyy HH:mm")}</p>
               </div>
            </CardContent>
         </Card>

         {/* Role management */}
         <Card>
            <CardHeader>
               <CardTitle>Rolle verwalten</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="flex items-center gap-4">
                  <div>
                     <p className="text-sm font-medium text-muted-foreground mb-1">Aktuelle Rolle</p>
                     <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role}
                     </Badge>
                  </div>
                  <div>
                     <p className="text-sm font-medium text-muted-foreground mb-1">Rolle ändern</p>
                     <AdminUserRoleForm userId={user.id} currentRole={user.role} />
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Subscription Info */}
         <Card>
            <CardHeader>
               <CardTitle>Abonnement</CardTitle>
            </CardHeader>
            <CardContent>
               {user.subscription ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">Plan</p>
                        <p className="text-sm">{user.subscription.plan.name} ({user.subscription.plan.tier})</p>
                     </div>
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <Badge>{user.subscription.status}</Badge>
                     </div>
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">Abrechnungsintervall</p>
                        <p className="text-sm">{user.subscription.billingInterval}</p>
                     </div>
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">Laufzeit bis</p>
                        <p className="text-sm">
                           {user.subscription.currentPeriodEnd
                              ? format(new Date(user.subscription.currentPeriodEnd), "dd.MM.yyyy")
                              : "—"}
                        </p>
                     </div>
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">Kündigung am Periodenende</p>
                        <p className="text-sm">{user.subscription.cancelAtPeriodEnd ? "Ja" : "Nein"}</p>
                     </div>
                  </div>
               ) : (
                  <p className="text-sm text-muted-foreground">Kein aktives Abonnement</p>
               )}
            </CardContent>
         </Card>

         {/* Subscription History */}
         {user.subscriptionHistory.length > 0 && (
            <Card>
               <CardHeader>
                  <CardTitle>Abo-Historie</CardTitle>
               </CardHeader>
               <CardContent>
                  <Table>
                     <TableHeader>
                        <TableRow>
                           <TableHead>Datum</TableHead>
                           <TableHead>Ereignis</TableHead>
                           <TableHead>Von Tier</TableHead>
                           <TableHead>Zu Tier</TableHead>
                           <TableHead>Von Status</TableHead>
                           <TableHead>Zu Status</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {user.subscriptionHistory.map((h) => (
                           <TableRow key={h.id}>
                              <TableCell>
                                 {format(new Date(h.createdAt), "dd.MM.yyyy HH:mm")}
                              </TableCell>
                              <TableCell>{h.eventType}</TableCell>
                              <TableCell>{h.fromTier ?? "—"}</TableCell>
                              <TableCell>{h.toTier ?? "—"}</TableCell>
                              <TableCell>{h.fromStatus ?? "—"}</TableCell>
                              <TableCell>{h.toStatus ?? "—"}</TableCell>
                           </TableRow>
                        ))}
                     </TableBody>
                  </Table>
               </CardContent>
            </Card>
         )}
      </div>
   );
};
