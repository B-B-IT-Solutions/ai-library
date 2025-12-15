"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { DSignInFormData } from "@/data/types/domain/user";
import { signInFormSchema } from "@/data/types/validators/user.schema";

export const CredentialsSignInForm = () => {
   const {
      handleSubmit,
      formState: { isSubmitting, errors },
      control,
      setError,
   } = useForm<DSignInFormData>({
      resolver: zodResolver(signInFormSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const searchParams = useSearchParams();
   const callbackUrl = searchParams.get("callbackUrl") || "/";

   const onSubmit: SubmitHandler<DSignInFormData> = async (data) => {
      const result = await signInWithCredentials(data);
      if (!result.success) {
         setError("root.serverError", {
            type: "custom",
            message: result.message,
         });
      }
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         data-testid="singin-form-credentails"
      >
         <input
            type="hidden"
            id="callbackUrl"
            name="callbackUrl"
            value={callbackUrl}
         />
         <div className="space-y-6">
            <FieldGroup>
               <Controller
                  name="email"
                  control={control}
                  render={({ field, fieldState }) => (
                     <Field
                        data-invalid={fieldState.invalid}
                        data-testid="email-field"
                     >
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                           {...field}
                           id="email"
                           autoComplete="email"
                           placeholder="Email"
                           aria-invalid={fieldState.invalid}
                           className="text-foreground"
                        />
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
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <Input
                           {...field}
                           id="password"
                           autoComplete="password"
                           type="password"
                           placeholder="Password"
                           aria-invalid={fieldState.invalid}
                           className="text-foreground"
                        />
                        {fieldState.invalid && (
                           <FieldError errors={[fieldState.error]} />
                        )}
                     </Field>
                  )}
               />
               <Field>
                  <Button
                     disabled={isSubmitting}
                     className="w-full"
                     variant="default"
                     type="submit"
                     data-testid="sign-in-btn"
                  >
                     {isSubmitting ? "Signing In..." : "Sign In"}
                  </Button>
                  {errors.root?.serverError && (
                     <FieldError
                        errors={[{ message: errors.root.serverError.message }]}
                     />
                  )}
               </Field>
            </FieldGroup>

            <div className="text-sm text-center text-muted-foreground">
               Don&apos;t have an account?{" "}
               <Link
                  href="/sign-up"
                  target="_self"
                  className="link text-accent-foreground"
                  data-testid="sign-up-link"
               >
                  Sign Up
               </Link>
            </div>
         </div>
      </form>
   );
};
