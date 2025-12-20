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
import { DSignUpFormData } from "@/data/types/domain/user";
import { signUpFormSchema } from "@/data/types/validators/user.schema";

import { getPasswordStrength, PasswordStrength } from "./utils";

export const SignUpForm = () => {
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

   const {
      handleSubmit,
      formState: { isSubmitting, errors },
      control,
      setError,
      watch,
   } = useForm<DSignUpFormData>({
      resolver: zodResolver(signUpFormSchema),
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

   const onSubmit: SubmitHandler<DSignUpFormData> = async (data) => {
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

   const getStrengthColor = (strength: PasswordStrength) => {
      switch (strength) {
         case "weak":
            return "bg-red-500";
         case "medium":
            return "bg-yellow-500";
         case "strong":
            return "bg-green-500";
         default:
            return "bg-gray-300";
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
         default:
            return "w-0";
      }
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
                        Full Name
                     </FieldLabel>
                     <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                           <User className="h-4 w-4" />
                        </div>
                        <Input
                           {...field}
                           id="name"
                           autoComplete="name"
                           placeholder="John Doe"
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
                        Email Address
                     </FieldLabel>
                     <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                           <Mail className="h-4 w-4" />
                        </div>
                        <Input
                           {...field}
                           id="email"
                           autoComplete="email"
                           placeholder="you@example.com"
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
                     <FieldLabel
                        htmlFor="password"
                        className="text-sm font-medium"
                     >
                        Password
                     </FieldLabel>
                     <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                           <Lock className="h-4 w-4" />
                        </div>
                        <Input
                           {...field}
                           id="password"
                           autoComplete="new-password"
                           type={showPassword ? "text" : "password"}
                           placeholder="Create a strong password"
                           aria-invalid={fieldState.invalid}
                           className="pl-10 pr-10 h-11 text-foreground transition-all focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                           type="button"
                           onClick={togglePasswordVisibility}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded p-0.5"
                           aria-label={
                              showPassword ? "Hide password" : "Show password"
                           }
                           data-testid="toggle-password-visibility"
                        >
                           {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                           ) : (
                              <Eye className="h-4 w-4" />
                           )}
                        </button>
                     </div>
                     {password && passwordStrength && (
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
                              Password strength:{" "}
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
                        Confirm Password
                     </FieldLabel>
                     <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                           <Check className="h-4 w-4" />
                        </div>
                        <Input
                           {...field}
                           id="confirmPassword"
                           type={showConfirmPassword ? "text" : "password"}
                           autoComplete="new-password"
                           placeholder="Confirm your password"
                           aria-invalid={fieldState.invalid}
                           className="pl-10 pr-10 h-11 text-foreground transition-all focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                           type="button"
                           onClick={toggleConfirmPasswordVisibility}
                           className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded p-0.5"
                           aria-label={
                              showConfirmPassword
                                 ? "Hide password"
                                 : "Show password"
                           }
                           data-testid="toggle-confirm-password-visibility"
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
                  data-testid="sign-up-btn"
               >
                  {isSubmitting ? (
                     <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Creating account...
                     </span>
                  ) : (
                     "Create Account"
                  )}
               </Button>
            </Field>
         </FieldGroup>

         <div className="text-sm text-center text-muted-foreground pt-2">
            Already have an account?{" "}
            <Link
               href="/sign-in"
               target="_self"
               className="font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
               data-testid="sign-in-link"
            >
               Sign in
            </Link>
         </div>
      </form>
   );
};
