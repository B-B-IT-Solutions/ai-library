"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Form } from "@/components/shadcn/form";
import { FormSelect, Option } from "@/components/shared/widgets/form-select";
import { updateUserRole } from "@/data/actions/admin/users";
import { DAdminUser } from "@/data/types/domain/admin/user";

const ROLE_OPTIONS: Option[] = [
   { value: "USER", label: "user" },
   { value: "PROMO_USER", label: "promo user" },
];

type Props = {
   user: DAdminUser;
};

export const UserRoleForm = ({ user }: Props) => {
   const [isPending, startTransition] = useTransition();

   const form = useForm<DAdminUser>({
      defaultValues: {
         role: user.role,
      },
   });

   const onSubmit = async (data: DAdminUser) => {
      startTransition(async () => {
         const result = await updateUserRole(user.id, data.role);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
      });
   };

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-end gap-3"
            data-testid="user-role-form"
         >
            <FormSelect<DAdminUser>
               name="role"
               label="Rolle"
               options={ROLE_OPTIONS}
               control={form.control}
            />
            <Button
               type="submit"
               size="sm"
               disabled={isPending}
               data-testid="save-btn"
            >
               {isPending ? "Speichern..." : "Speichern"}
            </Button>
         </form>
      </Form>
   );
};
