"use client";

import { useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
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
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import {
   getPasswordStrength,
   getStrengthColor,
   getStrengthWidth,
} from "@/components/shared/auth/utils";
import { updatePassword } from "@/data/actions/user";
import { DUserPasswordUpdate } from "@/data/types/domain/user";
import { updatePasswordSchema } from "@/data/types/validators/user";

export const UpdatePassword = () => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();
   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
   const [showNewPassword, setShowNewPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const form = useForm<DUserPasswordUpdate>({
      resolver: zodResolver(updatePasswordSchema),
      defaultValues: {
         currentPassword: "",
         newPassword: "",
         confirmPassword: "",
      },
   });

   const { isSubmitting } = form.formState;

   const newPassword = form.watch("newPassword");
   const passwordStrength = useMemo(
      () => getPasswordStrength(newPassword || ""),
      [newPassword]
   );

   const onSubmit: SubmitHandler<DUserPasswordUpdate> = async (data) => {
      startTransition(async () => {
         const result = await updatePassword(data);
         if (result.success) {
            toast.success(result.message);
            form.reset();
            // User will be redirected to sign-in page by the action
            router.push("/sign-in");
         } else {
            toast.error(result.message);
         }
      });
   };

   const submitBtnLabel = () => {
      if (isSubmitting || isPending) {
         return (
            <span className="flex items-center gap-2">
               <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
               Wird geändert...
            </span>
         );
      }
      return "Passwort ändern";
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

   const inputIcon = (visible: boolean) => {
      if (visible) {
         return <EyeOff className="h-4 w-4" data-testid="eye-off-icon" />;
      }
      return <Eye className="h-4 w-4" data-testid="eye-icon" />;
   };

   return (
      <Card data-testid="update-password">
         <CardHeader>
            <CardTitle>Sicherheit</CardTitle>
            <CardDescription>Ändern Sie Ihr Passwort</CardDescription>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  <FormField
                     control={form.control}
                     name="currentPassword"
                     render={({ field, fieldState }) => (
                        <FormItem data-testid="currentPassword">
                           <FormLabel className="text-sm font-medium">
                              Aktuelles Passwort
                           </FormLabel>
                           <FormControl>
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
                                    data-testid="currentPassword-input"
                                 />
                                 <button
                                    type="button"
                                    onClick={() =>
                                       setShowCurrentPassword(
                                          !showCurrentPassword
                                       )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded p-0.5"
                                    aria-label={
                                       showCurrentPassword
                                          ? "Passwort verbergen"
                                          : "Passwort anzeigen"
                                    }
                                    data-testid="currentPassword-visibility-btn"
                                 >
                                    {inputIcon(showCurrentPassword)}
                                 </button>
                              </div>
                           </FormControl>
                           <FormMessage data-testid="error-message" />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="newPassword"
                     render={({ field, fieldState }) => (
                        <FormItem data-testid="newPassword">
                           <FormLabel className="text-sm font-medium">
                              Neues Passwort
                           </FormLabel>
                           <FormControl>
                              <div>
                                 <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                       <Lock className="h-4 w-4" />
                                    </div>
                                    <Input
                                       {...field}
                                       id="newPassword"
                                       type={
                                          showNewPassword ? "text" : "password"
                                       }
                                       autoComplete="new-password"
                                       aria-invalid={fieldState.invalid}
                                       className="pl-10 pr-10 h-11"
                                       data-testid="newPassword-input"
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
                                       data-testid="newPassword-visibility-btn"
                                    >
                                       {inputIcon(showNewPassword)}
                                    </button>
                                 </div>
                                 {newPassword && passwordStrength && (
                                    <div className="mt-2 space-y-2">
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
                              </div>
                           </FormControl>
                           <FormMessage data-testid="error-message" />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="confirmPassword"
                     render={({ field, fieldState }) => (
                        <FormItem data-testid="confirmPassword">
                           <FormLabel className="text-sm font-medium">
                              Passwort bestätigen
                           </FormLabel>
                           <FormControl>
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
                                    data-testid="confirmPassword-input"
                                 />
                                 <button
                                    type="button"
                                    onClick={() =>
                                       setShowConfirmPassword(
                                          !showConfirmPassword
                                       )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded p-0.5"
                                    aria-label={
                                       showConfirmPassword
                                          ? "Passwort verbergen"
                                          : "Passwort anzeigen"
                                    }
                                    data-testid="confirmPassword-visibility-btn"
                                 >
                                    {inputIcon(showConfirmPassword)}
                                 </button>
                              </div>
                           </FormControl>
                           <FormMessage data-testid="error-message" />
                        </FormItem>
                     )}
                  />

                  <div className="flex justify-end">{submitBtn()}</div>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};
