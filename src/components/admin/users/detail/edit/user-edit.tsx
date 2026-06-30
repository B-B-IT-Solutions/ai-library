import { Badge } from "@/components/shadcn/badge";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import { DAdminUser } from "@/data/types/domain/admin/user";
import { formatDateTime } from "@/lib/utils";

import { UserRoleForm } from "./form/user-role-form";

type Props = {
   user: DAdminUser;
};

export const AdminUserEdit = ({ user }: Props) => {
   return (
      <div
         className="container mx-auto max-w-7xl px-4 py-8"
         data-testid="admin-user-edit"
      >
         <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
               {user.name}
            </h1>
            <p className="text-slate-600">{user.email}</p>
         </div>
         <div className="space-y-6">
            {/* User Info */}
            <Card>
               <CardHeader>
                  <CardTitle>Nutzerinformationen</CardTitle>
               </CardHeader>
               <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                     <p className="text-sm font-medium text-muted-foreground">
                        ID
                     </p>
                     <p className="font-mono text-sm">{user.id}</p>
                  </div>
                  <div>
                     <p className="text-sm font-medium text-muted-foreground">
                        Name
                     </p>
                     <p className="text-sm">{user.name}</p>
                  </div>
                  <div>
                     <p className="text-sm font-medium text-muted-foreground">
                        E-Mail
                     </p>
                     <p className="text-sm">{user.email}</p>
                  </div>
                  <div>
                     <p className="text-sm font-medium text-muted-foreground">
                        E-Mail verifiziert
                     </p>
                     <p className="text-sm">
                        {user.emailVerified ? (
                           <Badge variant="default">
                              Ja — {formatDateTime(user.emailVerified).dateOnly}
                           </Badge>
                        ) : (
                           <Badge variant="destructive">Nein</Badge>
                        )}
                     </p>
                  </div>
                  <div>
                     <p className="text-sm font-medium text-muted-foreground">
                        Stripe Customer ID
                     </p>
                     <p className="font-mono text-sm">
                        {user.stripeCustomerId ?? "—"}
                     </p>
                  </div>
                  <div>
                     <p className="text-sm font-medium text-muted-foreground">
                        Trial endet am
                     </p>
                     <p className="text-sm">
                        {user.trialEndsAt
                           ? formatDateTime(user.trialEndsAt).dateOnly
                           : "—"}
                     </p>
                  </div>
                  <div>
                     <p className="text-sm font-medium text-muted-foreground">
                        Erstellt
                     </p>
                     <p className="text-sm">
                        {formatDateTime(user.createdAt).dateTime}
                     </p>
                  </div>
                  <div>
                     <p className="text-sm font-medium text-muted-foreground">
                        Aktualisiert
                     </p>
                     <p className="text-sm">
                        {formatDateTime(user.updatedAt).dateTime}
                     </p>
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
                        <p className="mb-1 text-sm font-medium text-muted-foreground">
                           Aktuelle Rolle
                        </p>
                        <Badge
                           variant={
                              user.role === "admin" ? "default" : "secondary"
                           }
                        >
                           {user.role}
                        </Badge>
                     </div>
                     <div>
                        <p className="mb-1 text-sm font-medium text-muted-foreground">
                           Rolle ändern
                        </p>
                        <UserRoleForm user={user} />
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
   );
};
