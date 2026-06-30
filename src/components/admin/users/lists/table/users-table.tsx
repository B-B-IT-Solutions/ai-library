import { format } from "date-fns";
import Link from "next/link";

import { Badge } from "@/components/shadcn/badge";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/shadcn/table";
import { DAdminUsersPage } from "@/data/types/domain/admin/admin";

type Props = {
   usersPage: DAdminUsersPage;
};

export const UsersTable = ({ usersPage }: Props) => {
   return (
      <div data-testid="users-table">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>E-Mail</TableHead>
                  <TableHead>Rolle</TableHead>
                  <TableHead>Abo-Tier</TableHead>
                  <TableHead>Abo-Status</TableHead>
                  <TableHead>E-Mail verifiziert</TableHead>
                  <TableHead>Erstellt</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {usersPage.content.map((user) => (
                  <TableRow key={user.id}>
                     <TableCell>
                        <Link
                           href={`/admin/users/${user.id}/edit`}
                           className="font-medium text-primary hover:underline"
                        >
                           {user.name}
                        </Link>
                     </TableCell>
                     <TableCell>{user.email}</TableCell>
                     <TableCell>
                        <Badge
                           variant={
                              user.role === "admin" ? "default" : "secondary"
                           }
                        >
                           {user.role}
                        </Badge>
                     </TableCell>
                     <TableCell>{user.subscriptionTier ?? "—"}</TableCell>
                     <TableCell>{user.subscriptionStatus ?? "—"}</TableCell>
                     <TableCell>
                        {user.emailVerified ? (
                           <Badge variant="default">Ja</Badge>
                        ) : (
                           <Badge variant="destructive">Nein</Badge>
                        )}
                     </TableCell>
                     <TableCell>
                        {format(new Date(user.createdAt), "dd.MM.yyyy")}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
         <div className="mt-4 text-sm text-muted-foreground">
            {usersPage.numberOfElements} von {usersPage.totalElements} Nutzern
         </div>
      </div>
   );
};
