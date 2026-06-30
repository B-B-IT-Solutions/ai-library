"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { updateUserRole } from "@/data/actions/admin/users/user.admin.actions";

type Props = {
   userId: string;
   currentRole: string;
};

export const UserRoleForm = ({ userId, currentRole }: Props) => {
   const [role, setRole] = useState<"user" | "admin">(
      currentRole === "admin" ? "admin" : "user"
   );
   const [isPending, setIsPending] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsPending(true);
      try {
         const result = await updateUserRole(userId, role);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
      } finally {
         setIsPending(false);
      }
   };

   return (
      <form
         onSubmit={handleSubmit}
         className="flex items-center gap-3"
         data-testid="user-role-form"
      >
         <select
            value={role}
            onChange={(e) => setRole(e.target.value as "user" | "admin")}
            className="rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
            disabled={isPending}
         >
            <option value="user">user</option>
            <option value="admin">admin</option>
         </select>
         <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Speichern..." : "Speichern"}
         </Button>
      </form>
   );
};
