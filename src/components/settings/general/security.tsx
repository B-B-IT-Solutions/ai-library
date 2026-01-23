"use client";

import { useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
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
import {
   getPasswordStrength,
   PasswordStrength,
} from "@/components/shared/auth/utils";
import { changePassword } from "@/data/actions/user/settings.actions";
import { changePasswordSchema } from "@/data/types/validators/user";

type ChangePasswordFormData = {
   currentPassword: string;
   newPassword: string;
   confirmPassword: string;
};

export const SecuritySection = () => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();
   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
   const [showNewPassword, setShowNewPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const {
      handleSubmit,
      formState: { isSubmitting, errors },
      control,
      reset,
      watch,
   } = useForm<ChangePasswordFormData>({
      resolver: zodResolver(changePasswordSchema),
      defaultValues: {
         currentPassword: "",
         newPassword: "",
         confirmPassword: "",
      },
   });

   const newPassword = watch("newPassword");
   const passwordStrength = useMemo(
      () => getPasswordStrength(newPassword || ""),
      [newPassword]
   );

   const onSubmit: SubmitHandler<ChangePasswordFormData> = async (data) => {
      startTransition(async () => {
         const result = await changePassword(
            data.currentPassword,
            data.newPassword,
            data.confirmPassword
         );
         if (result.success) {
            toast.success(result.message);
            reset();
            // User will be redirected to sign-in page by the action
            router.push("/sign-in");
         } else {
            toast.error(result.message);
         }
      });
   };

   const getStrengthColor = (strength: PasswordStrength) => {
      switch (strength) {
         case "weak":
            return "bg-red-500";
         case "medium":
            return "bg-yellow-500";
         case "strong":
            return "bg-green-500";
      }
   };

   const getStrengthWidth = (strength: PasswordStrength) => {
      switch (strength) {
         case "weak":
            return "w-1/3";
         case "medium":
            return "w-2/3";
         case "strong":
            return "w-full";
      }
   };

   return (
      <Card data-testid="update-password">
         <CardHeader>
            <CardTitle>Sicherheit</CardTitle>
            <CardDescription>Ändern Sie Ihr Passwort</CardDescription>
         </CardHeader>
         <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
               <FieldGroup>
                  <Controller
                     name="currentPassword"
                     control={control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel
                              htmlFor="currentPassword"
                              className="text-sm font-medium"
                           >
                              Aktuelles Passwort
                           </FieldLabel>
                           <div className="relative">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                 <Lock className="h-4 w-4" />
                              </div>
                              <Input
                                 {...field}
                                 id="currentPassword"
                                 type={
                                    showCurrentPassword ? "text" : "password"
                                 }
                                 autoComplete="current-password"
                                 aria-invalid={fieldState.invalid}
                                 className="pl-10 pr-10 h-11"
                              />
                              <button
                                 type="button"
                                 onClick={() =>
                                    setShowCurrentPassword(!showCurrentPassword)
                                 }
                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded p-0.5"
                                 aria-label={
                                    showCurrentPassword
                                       ? "Passwort verbergen"
                                       : "Passwort anzeigen"
                                 }
                              >
                                 {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                 ) : (
                                    <Eye className="h-4 w-4" />
                                 )}
                              </button>
                           </div>
                           {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                           )}
                        </Field>
                     )}
                  />

                  <Controller
                     name="newPassword"
                     control={control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel
                              htmlFor="newPassword"
                              className="text-sm font-medium"
                           >
                              Neues Passwort
                           </FieldLabel>
                           <div className="relative">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                 <Lock className="h-4 w-4" />
                              </div>
                              <Input
                                 {...field}
                                 id="newPassword"
                                 type={showNewPassword ? "text" : "password"}
                                 autoComplete="new-password"
                                 aria-invalid={fieldState.invalid}
                                 className="pl-10 pr-10 h-11"
                              />
                              <button
                                 type="button"
                                 onClick={() =>
                                    setShowNewPassword(!showNewPassword)
                                 }
                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded p-0.5"
                                 aria-label={
                                    showNewPassword
                                       ? "Passwort verbergen"
                                       : "Passwort anzeigen"
                                 }
                              >
                                 {showNewPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                 ) : (
                                    <Eye className="h-4 w-4" />
                                 )}
                              </button>
                           </div>
                           {newPassword && passwordStrength && (
                              <div className="space-y-1">
                                 <div className="flex gap-1">
                                    <div className="flex-1 h-1 rounded-full bg-gray-200">
                                       <div
                                          className={`h-full rounded-full transition-all duration-300 ${getStrengthColor(
                                             passwordStrength
                                          )} ${getStrengthWidth(passwordStrength)}`}
                                       />
                                    </div>
                                 </div>
                                 <p className="text-xs text-muted-foreground capitalize">
                                    Passwortstärke:{" "}
                                    <span className="font-medium">
                                       {passwordStrength}
                                    </span>
                                 </p>
                              </div>
                           )}
                           {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                           )}
                        </Field>
                     )}
                  />

                  <Controller
                     name="confirmPassword"
                     control={control}
                     render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                           <FieldLabel
                              htmlFor="confirmPassword"
                              className="text-sm font-medium"
                           >
                              Passwort bestätigen
                           </FieldLabel>
                           <div className="relative">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                 <Lock className="h-4 w-4" />
                              </div>
                              <Input
                                 {...field}
                                 id="confirmPassword"
                                 type={
                                    showConfirmPassword ? "text" : "password"
                                 }
                                 autoComplete="new-password"
                                 aria-invalid={fieldState.invalid}
                                 className="pl-10 pr-10 h-11"
                              />
                              <button
                                 type="button"
                                 onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                 }
                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded p-0.5"
                                 aria-label={
                                    showConfirmPassword
                                       ? "Passwort verbergen"
                                       : "Passwort anzeigen"
                                 }
                              >
                                 {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                 ) : (
                                    <Eye className="h-4 w-4" />
                                 )}
                              </button>
                           </div>
                           {fieldState.invalid && (
                              <FieldError errors={[fieldState.error]} />
                           )}
                        </Field>
                     )}
                  />
               </FieldGroup>

               <div className="flex justify-end">
                  <Button
                     disabled={isSubmitting || isPending}
                     type="submit"
                     className="cursor-pointer"
                  >
                     {isSubmitting || isPending ? (
                        <span className="flex items-center gap-2">
                           <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                           Wird geändert...
                        </span>
                     ) : (
                        "Passwort ändern"
                     )}
                  </Button>
               </div>
            </form>
         </CardContent>
      </Card>
   );
};
