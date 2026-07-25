"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
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
import { signInWithCredentials } from "@/data/actions/user";
import { DUserSignIn } from "@/data/types/domain/user";
import { signInSchema } from "@/data/types/validators/user";

export const CredentialsSignInForm = () => {
   const [showPassword, setShowPassword] = useState(false);
   const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

   const {
      handleSubmit,
      formState: { isSubmitting, errors },
      control,
      setError,
   } = useForm<DUserSignIn>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const searchParams = useSearchParams();
   const callbackUrl = searchParams.get("callbackUrl") || "/prompts";

   const onSubmit: SubmitHandler<DUserSignIn> = async (data) => {
      setUnverifiedEmail(null);
      const result = await signInWithCredentials(data, callbackUrl);
      if (!result.success) {
         if (result.data?.emailNotVerified) {
            setUnverifiedEmail(data.email);
         } else {
            setError("root.serverError", {
               type: "custom",
               message: result.message,
            });
         }
      }
   };

   const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
   };

   const unverifiedEmailBanner = () => {
      if (unverifiedEmail) {
         return (
            <div
               className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
               data-testid="email-not-verified-banner"
            >
               <p>
                  E-Mail-Adresse nicht bestätigt. Bitte überprüfe dein Postfach.
               </p>
               <Link
                  href={`/auth/verify-email?email=${encodeURIComponent(unverifiedEmail)}`}
                  className="mt-1 block font-medium underline-offset-2 hover:underline"
                  data-testid="verify-email-link"
               >
                  Erneut senden
               </Link>
            </div>
         );
      }
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         data-testid="singin-form-credentails"
         className="space-y-5"
      >
         <FieldGroup>
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
                     <div className="flex items-center justify-between">
                        <FieldLabel
                           htmlFor="password"
                           className="text-sm font-medium"
                        >
                           Passwort
                        </FieldLabel>
                        <Link
                           href="/auth/forgot-password"
                           className="text-xs text-primary transition-colors hover:text-primary/80"
                           data-testid="forgot-password-link"
                        >
                           Passwort vergessen?
                        </Link>
                     </div>
                     <div className="relative">
                        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                           <Lock className="h-4 w-4" />
                        </div>
                        <Input
                           {...field}
                           id="password"
                           autoComplete="current-password"
                           type={showPassword ? "text" : "password"}
                           placeholder="Geben Sie Ihr Passwort ein"
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
            {unverifiedEmailBanner()}
            <Field>
               <Button
                  disabled={isSubmitting}
                  className="h-11 w-full cursor-pointer text-base font-medium transition-all hover:shadow-lg"
                  variant="default"
                  type="submit"
                  data-testid="sign-in-btn"
               >
                  {isSubmitting ? (
                     <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Wird angemeldet...
                     </span>
                  ) : (
                     "Anmelden"
                  )}
               </Button>
            </Field>
         </FieldGroup>

         <div className="pt-2 text-center text-sm text-muted-foreground">
            Noch kein Konto?{" "}
            <Link
               href="/auth/sign-up"
               target="_self"
               className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
               data-testid="sign-up-link"
            >
               Registrieren
            </Link>
         </div>
      </form>
   );
};
