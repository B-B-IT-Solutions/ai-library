"use client";

import { FC, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import {
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
} from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { updateProfile } from "@/data/actions/user";
import { DUser, DUserUpdateData } from "@/data/types/domain/user";
import { updateProfileSchema } from "@/data/types/validators/user";

type UserProfileProps = {
   user: DUser;
};

export const UserProfile: FC<UserProfileProps> = ({ user }) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const {
      handleSubmit,
      formState: { isSubmitting },
      control,
   } = useForm<DUserUpdateData>({
      resolver: zodResolver(updateProfileSchema),
      defaultValues: {
         name: user.name,
      },
   });

   const onSubmit: SubmitHandler<DUserUpdateData> = async (data) => {
      startTransition(async () => {
         const result = await updateProfile(data.name);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
         router.refresh();
      });
   };

   const submitBtnLabel = () => {
      if (isSubmitting || isPending) {
         return (
            <span className="flex items-center gap-2">
               <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
               Wird aktualisiert...
            </span>
         );
      }
      return "Aktualisieren";
   };

   const submitBtn = () => {
      return (
         <Button
            disabled={isSubmitting || isPending}
            type="submit"
            className="cursor-pointer"
            data-testid="submit-btn"
         >
            {submitBtnLabel()}
         </Button>
      );
   };

   return (
      <Card data-testid="user-profile">
         <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>
               Verwalten Sie Ihre persönlichen Informationen
            </CardDescription>
         </CardHeader>
         <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
               <FieldGroup>
                  <Controller
                     name="name"
                     control={control}
                     render={({ field, fieldState }) => (
                        <Field
                           data-invalid={fieldState.invalid}
                           data-testid="name"
                        >
                           <FieldLabel
                              htmlFor="name"
                              className="text-sm font-medium"
                           >
                              Name
                           </FieldLabel>
                           <div className="relative">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                 <User className="h-4 w-4" />
                              </div>
                              <Input
                                 {...field}
                                 id="name"
                                 autoComplete="name"
                                 aria-invalid={fieldState.invalid}
                                 className="pl-10 h-11"
                                 data-testid="name-input"
                              />
                           </div>
                           {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                           )}
                        </Field>
                     )}
                  />
               </FieldGroup>

               <div className="space-y-3" data-testid="email">
                  <FieldLabel className="text-sm font-medium">
                     E-Mail-Adresse
                  </FieldLabel>
                  <Input
                     value={user.email}
                     disabled
                     className="h-11 bg-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                     Ihre E-Mail-Adresse kann nicht geändert werden
                  </p>
               </div>
               <div className="flex justify-end">{submitBtn()}</div>
            </form>
         </CardContent>
      </Card>
   );
};
