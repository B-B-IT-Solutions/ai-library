"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import {
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
} from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { signUpUser } from "@/data/actions/user";
import { DUserSignUp } from "@/data/types/domain/user";
import { signUpSchema } from "@/data/types/validators/user";

import {
   getPasswordStrength,
   getStrengthColor,
   getStrengthWidth,
} from "./utils";

export const SignUpForm = () => {
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const {
      handleSubmit,
      formState: { isSubmitting, errors },
      control,
      setError,
      watch,
   } = useForm<DUserSignUp>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
         name: "",
         email: "",
         password: "",
         confirmPassword: "",
      },
   });

   const searchParams = useSearchParams();
   const callbackUrl = searchParams.get("callbackUrl") || "/";

   const password = watch("password");
   const passwordStrength = useMemo(
      () => getPasswordStrength(password || ""),
      [password]
   );

   const onSubmit: SubmitHandler<DUserSignUp> = async (data) => {
      const result = await signUpUser(data);
      if (!result.success) {
         setError("root.serverError", {
            type: "custom",
            message: result.message,
         });
      }
   };

   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
   };

   const toggleConfirmPasswordVisibility = () => {
      setShowConfirmPassword(!showConfirmPassword);
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         data-testid="sign-up-form"
         className="space-y-5"
      >
         <input
            type="hidden"
            id="callbackUrl"
            name="callbackUrl"
            value={callbackUrl}
         />
         <FieldGroup>
            <Controller
               name="name"
               control={control}
               render={({ field, fieldState }) => (
                  <Field
                     data-invalid={fieldState.invalid}
                     data-testid="name-field"
                  >
                     <FieldLabel htmlFor="name" className="text-sm font-medium">
                        Vollständiger Name
                     </FieldLabel>
                     <div className="relative">
                        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                           <User className="h-4 w-4" />
                        </div>
                        <Input
                           {...field}
                           id="name"
                           autoComplete="name"
                           placeholder="Max Mustermann"
                           aria-invalid={fieldState.invalid}
                           className="h-11 pl-10 text-foreground transition-all focus:ring-2 focus:ring-primary/20"
                        />
                     </div>
                     {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                     )}
                  </Field>
               )}
            />
            <Controller
               name="email"
               control={control}
               render={({ field, fieldState }) => (
                  <Field
                     data-invalid={fieldState.invalid}
                     data-testid="email-field"
                  >
                     <FieldLabel
                        htmlFor="email"
                        className="text-sm font-medium"
                     >
                        E-Mail-Adresse
                     </FieldLabel>
                     <div className="relative">
                        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                           <Mail className="h-4 w-4" />
                        </div>
                        <Input
                           {...field}
                           id="email"
                           autoComplete="email"
                           placeholder="ihre@beispiel.com"
                           aria-invalid={fieldState.invalid}
                           className="h-11 pl-10 text-foreground transition-all focus:ring-2 focus:ring-primary/20"
                        />
                     </div>
                     {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                     )}
                  </Field>
               )}
            />
            <Controller
               name="password"
               control={control}
               render={({ field, fieldState }) => (
                  <Field
                     data-invalid={fieldState.invalid}
                     data-testid="password-field"
                  >
                     <FieldLabel
                        htmlFor="password"
                        className="text-sm font-medium"
                     >
                        Passwort
                     </FieldLabel>
                     <div className="relative">
                        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                           <Lock className="h-4 w-4" />
                        </div>
                        <Input
                           {...field}
                           id="password"
                           autoComplete="new-password"
                           type={showPassword ? "text" : "password"}
                           placeholder="Erstellen Sie ein sicheres Passwort"
                           aria-invalid={fieldState.invalid}
                           className="h-11 pr-10 pl-10 text-foreground transition-all focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                           type="button"
                           onClick={togglePasswordVisibility}
                           className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                           aria-label={
                              showPassword
                                 ? "Passwort verbergen"
                                 : "Passwort anzeigen"
                           }
                           data-testid="toggle-password-visibility"
                        >
                           {showPassword ? (
                              <EyeOff
                                 className="h-4 w-4"
                                 data-testid="eye-off-icon"
                              />
                           ) : (
                              <Eye className="h-4 w-4" data-testid="eye-icon" />
                           )}
                        </button>
                     </div>
                     {password && passwordStrength && (
                        <div className="space-y-1">
                           <div className="flex gap-1">
                              <div className="h-1 flex-1 rounded-full bg-gray-200">
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
                  <Field
                     data-invalid={fieldState.invalid}
                     data-testid="confirm-password-field"
                  >
                     <FieldLabel
                        htmlFor="confirmPassword"
                        className="text-sm font-medium"
                     >
                        Passwort bestätigen
                     </FieldLabel>
                     <div className="relative">
                        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                           <Check className="h-4 w-4" />
                        </div>
                        <Input
                           {...field}
                           id="confirmPassword"
                           type={showConfirmPassword ? "text" : "password"}
                           autoComplete="new-password"
                           placeholder="Bestätigen Sie Ihr Passwort"
                           aria-invalid={fieldState.invalid}
                           className="h-11 pr-10 pl-10 text-foreground transition-all focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                           type="button"
                           onClick={toggleConfirmPasswordVisibility}
                           className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                           aria-label={
                              showConfirmPassword
                                 ? "Passwort verbergen"
                                 : "Passwort anzeigen"
                           }
                           data-testid="toggle-confirm-password-visibility"
                        >
                           {showConfirmPassword ? (
                              <EyeOff
                                 className="h-4 w-4"
                                 data-testid="eye-off-icon"
                              />
                           ) : (
                              <Eye className="h-4 w-4" data-testid="eye-icon" />
                           )}
                        </button>
                     </div>
                     {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                     )}
                  </Field>
               )}
            />
            {errors.root?.serverError && (
               <div className="rounded-md border border-destructive/20 bg-destructive/10 p-3">
                  <FieldError
                     errors={[{ message: errors.root.serverError.message }]}
                  />
               </div>
            )}
            <Field>
               <Button
                  disabled={isSubmitting}
                  className="h-11 w-full cursor-pointer text-base font-medium transition-all hover:shadow-lg"
                  variant="default"
                  type="submit"
                  data-testid="sign-up-btn"
               >
                  {isSubmitting ? (
                     <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Konto wird erstellt...
                     </span>
                  ) : (
                     "Konto erstellen"
                  )}
               </Button>
            </Field>
         </FieldGroup>

         <div className="pt-2 text-center text-sm text-muted-foreground">
            Bereits ein Konto?{" "}
            <Link
               href="/auth/sign-in"
               target="_self"
               className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
               data-testid="sign-in-link"
            >
               Anmelden
            </Link>
         </div>
      </form>
   );
};
