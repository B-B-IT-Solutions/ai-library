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
   const callbackUrl = searchParams.get("callbackUrl") || "/";

   const onSubmit: SubmitHandler<DUserSignIn> = async (data) => {
      const result = await signInWithCredentials(data);
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

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         data-testid="singin-form-credentails"
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
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                           <Mail className="h-4 w-4" />
                        </div>
                        <Input
                           {...field}
                           id="email"
                           autoComplete="email"
                           placeholder="ihre@beispiel.com"
                           aria-invalid={fieldState.invalid}
                           className="pl-10 h-11 text-foreground transition-all focus:ring-2 focus:ring-primary/20"
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
                           href="/forgot-password"
                           className="text-xs text-primary hover:text-primary/80 transition-colors"
                           data-testid="forgot-password-link"
                        >
                           Passwort vergessen?
                        </Link>
                     </div>
                     <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                           <Lock className="h-4 w-4" />
                        </div>
                        <Input
                           {...field}
                           id="password"
                           autoComplete="current-password"
                           type={showPassword ? "text" : "password"}
                           placeholder="Geben Sie Ihr Passwort ein"
                           aria-invalid={fieldState.invalid}
                           className="pl-10 pr-10 h-11 text-foreground transition-all focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                           type="button"
                           onClick={togglePasswordVisibility}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded p-0.5"
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
               <div className="rounded-md bg-destructive/10 p-3 border border-destructive/20">
                  <FieldError
                     errors={[{ message: errors.root.serverError.message }]}
                  />
               </div>
            )}
            <Field>
               <Button
                  disabled={isSubmitting}
                  className="w-full h-11 text-base font-medium transition-all hover:shadow-lg cursor-pointer"
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

         <div className="text-sm text-center text-muted-foreground pt-2">
            Noch kein Konto?{" "}
            <Link
               href="/sign-up"
               target="_self"
               className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
               data-testid="sign-up-link"
            >
               Registrieren
            </Link>
         </div>
      </form>
   );
};
