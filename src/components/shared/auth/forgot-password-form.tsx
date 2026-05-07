"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/shadcn/button";
import {
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
} from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { requestPasswordReset } from "@/data/actions/user";
import { DForgotPassword } from "@/data/types/domain/user";
import { forgotPasswordSchema } from "@/data/types/validators/user";

export const ForgotPasswordForm = () => {
   const [submitted, setSubmitted] = useState(false);

   const {
      handleSubmit,
      formState: { isSubmitting, errors },
      control,
      setError,
   } = useForm<DForgotPassword>({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: { email: "" },
   });

   const onSubmit: SubmitHandler<DForgotPassword> = async (data) => {
      const result = await requestPasswordReset(data);
      if (result.success) {
         setSubmitted(true);
      } else {
         setError("root.serverError", {
            type: "custom",
            message: result.message,
         });
      }
   };

   if (submitted) {
      return (
         <div
            className="rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-700"
            data-testid="reset-email-sent-banner"
         >
            <p className="font-medium">E-Mail gesendet</p>
            <p className="mt-1">
               Falls ein Konto mit dieser E-Mail-Adresse existiert, haben wir
               dir einen Link zum Zurücksetzen des Passworts gesendet. Bitte
               überprüfe dein Postfach.
            </p>
         </div>
      );
   }

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="space-y-5"
         data-testid="forgot-password-form"
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
                  data-testid="reset-password-btn"
               >
                  {isSubmitting ? (
                     <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Wird gesendet...
                     </span>
                  ) : (
                     "Link senden"
                  )}
               </Button>
            </Field>
         </FieldGroup>

         <div className="pt-2 text-center text-sm text-muted-foreground">
            <Link
               href="/auth/sign-in"
               className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
               data-testid="sign-in-link"
            >
               Zurück zur Anmeldung
            </Link>
         </div>
      </form>
   );
};
