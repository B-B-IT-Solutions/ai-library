"use client";

import { FC, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { de } from "date-fns/locale";
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
import { updateProfile } from "@/data/actions/user/settings.actions";
import { DUser } from "@/data/types/domain/user";
import { updateProfileSchema } from "@/data/types/validators/settings.schema";

type ProfileSectionProps = {
   user: DUser;
};

type UpdateProfileFormData = {
   name: string;
};

export const ProfileSection: FC<ProfileSectionProps> = ({ user }) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const {
      handleSubmit,
      formState: { isSubmitting, errors },
      control,
      setError,
   } = useForm<UpdateProfileFormData>({
      resolver: zodResolver(updateProfileSchema),
      defaultValues: {
         name: user.name,
      },
   });

   const onSubmit: SubmitHandler<UpdateProfileFormData> = async (data) => {
      startTransition(async () => {
         const result = await updateProfile(data.name);
         if (result.success) {
            toast.success(result.message);
            router.refresh();
         } else {
            toast.error(result.message);
         }
      });
   };

   const getRoleBadgeColor = (role: string) => {
      switch (role) {
         case "ADMIN":
            return "bg-red-100 text-red-800 border-red-200";
         case "MANAGER":
            return "bg-blue-100 text-blue-800 border-blue-200";
         default:
            return "bg-gray-100 text-gray-800 border-gray-200";
      }
   };

   return (
      <Card>
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
                        <Field data-invalid={fieldState.invalid}>
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
                              />
                           </div>
                           {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                           )}
                        </Field>
                     )}
                  />
               </FieldGroup>

               <div className="space-y-4">
                  <div>
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

                  <div>
                     <FieldLabel className="text-sm font-medium">
                        Rolle
                     </FieldLabel>
                     <div className="mt-2">
                        <span
                           className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium border ${getRoleBadgeColor(
                              user.role
                           )}`}
                        >
                           {user.role}
                        </span>
                     </div>
                  </div>

                  <div>
                     <FieldLabel className="text-sm font-medium">
                        Konto erstellt am
                     </FieldLabel>
                     <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(user.createdAt), "PPP", {
                           locale: de,
                        })}
                     </p>
                  </div>
               </div>

               <div className="flex justify-end">
                  <Button
                     disabled={isSubmitting || isPending}
                     type="submit"
                     className="cursor-pointer"
                  >
                     {isSubmitting || isPending ? (
                        <span className="flex items-center gap-2">
                           <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                           Wird aktualisiert...
                        </span>
                     ) : (
                        "Aktualisieren"
                     )}
                  </Button>
               </div>
            </form>
         </CardContent>
      </Card>
   );
};
