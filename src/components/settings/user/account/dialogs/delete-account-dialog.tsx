"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
   AlertDialog,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/shadcn/alert-dialog";
import { Button } from "@/components/shadcn/button";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { deleteUser } from "@/data/actions/user";
import { DUserAccountDelete } from "@/data/types/domain/user";
import { deleteAccountSchema } from "@/data/types/validators/user";

type Props = {
   canDelete: boolean;
};

export const DeleteAcountDialog = ({ canDelete }: Props) => {
   const [isOpen, setIsOpen] = useState(false);
   const [isPending, startTransition] = useTransition();
   const [showPassword, setShowPassword] = useState(false);

   const toggleShowPassword = () => {
      setShowPassword(!showPassword);
   };

   const form = useForm<DUserAccountDelete>({
      resolver: zodResolver(deleteAccountSchema),
      defaultValues: {
         password: "",
      },
   });

   const { isSubmitting } = form.formState;

   const onSubmit: SubmitHandler<DUserAccountDelete> = async (data) => {
      startTransition(async () => {
         const result = await deleteUser(data);
         if (result.success) {
            toast.success(result.message);
            setIsOpen(false);
         } else {
            toast.error(result.message);
         }
      });
   };

   const handleCancel = () => {
      setIsOpen(false);
      form.reset();
      setShowPassword(false);
   };

   const inputType = (visible: boolean) => {
      return visible ? "text" : "password";
   };

   const inputIcon = (visible: boolean) => {
      if (visible) {
         return <EyeOff className="h-4 w-4" data-testid="eye-off-icon" />;
      }
      return <Eye className="h-4 w-4" data-testid="eye-icon" />;
   };

   const inputAriaLabel = (visible: boolean) => {
      return visible ? "Passwort verbergen" : "Passwort anzeigen";
   };

   const submitBtnLabel = () => {
      if (isSubmitting || isPending) {
         return (
            <span className="flex items-center gap-2">
               <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
               Wird gelöscht...
            </span>
         );
      }
      return "Konto dauerhaft löschen";
   };

   const blockedNotice = () => {
      if (!canDelete) {
         return (
            <div
               className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-800/60 dark:bg-amber-950/40"
               data-testid="delete-blocked-notice"
            >
               <Lock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
               <div className="space-y-1">
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                     Löschen nicht möglich
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                     Ihr Konto hat ein aktives Abonnement. Bitte kündigen Sie
                     zuerst Ihr Abo, bevor Sie das Konto löschen.{" "}
                     <Link
                        href="/settings/subscription"
                        className="font-medium underline underline-offset-4 hover:text-amber-900 dark:hover:text-amber-100"
                        data-testid="subscription-link"
                     >
                        Zum Abonnement
                     </Link>
                  </p>
               </div>
            </div>
         );
      }
   };

   const dialog = () => {
      return (
         <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild={true}>
               <Button
                  variant="destructive"
                  disabled={!canDelete}
                  className="cursor-pointer disabled:cursor-not-allowed"
                  data-testid="delete-btn"
               >
                  Konto löschen
               </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-md">
               <AlertDialogHeader>
                  <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10">
                        <TriangleAlert className="h-5 w-5 text-destructive" />
                     </div>
                     <AlertDialogTitle className="text-lg">
                        Konto dauerhaft löschen?
                     </AlertDialogTitle>
                  </div>
                  <AlertDialogDescription asChild={true}>
                     <div className="space-y-3 pt-1">
                        <p className="text-sm text-muted-foreground">
                           Diese Aktion ist <strong>nicht umkehrbar</strong>.
                           Alle Ihre Daten — Prompts, Sammlungen und
                           Bestellungen — werden dauerhaft gelöscht.
                        </p>
                        <div className="rounded-md border border-destructive/20 bg-destructive/5 px-3 py-2.5">
                           <p className="text-sm font-medium text-destructive">
                              ⚠ Ihr Konto wird sofort und unwiderruflich
                              gelöscht.
                           </p>
                        </div>
                     </div>
                  </AlertDialogDescription>
               </AlertDialogHeader>

               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="mt-2 space-y-4"
                  >
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                           <FormItem data-testid="password">
                              <FormLabel className="text-sm font-medium">
                                 Passwort zur Bestätigung eingeben
                              </FormLabel>
                              <FormControl>
                                 <div className="relative">
                                    <Input
                                       {...field}
                                       id="delete-password"
                                       type={inputType(showPassword)}
                                       autoComplete="current-password"
                                       placeholder="Ihr aktuelles Passwort"
                                       aria-invalid={fieldState.invalid}
                                       className="h-11 pr-10"
                                       data-testid="password-input"
                                    />
                                    <button
                                       type="button"
                                       onClick={toggleShowPassword}
                                       className="absolute top-1/2 right-3 -translate-y-1/2 rounded p-0.5 text-muted-foreground transition-colors hover:text-foreground focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                       aria-label={inputAriaLabel(showPassword)}
                                       data-testid="password-visibility-btn"
                                    >
                                       {inputIcon(showPassword)}
                                    </button>
                                 </div>
                              </FormControl>
                              <FormMessage data-testid="error-message" />
                           </FormItem>
                        )}
                     />

                     <AlertDialogFooter className="gap-2 sm:gap-0">
                        <AlertDialogCancel
                           type="button"
                           onClick={handleCancel}
                           disabled={isSubmitting || isPending}
                           data-testid="cancel-btn"
                        >
                           Abbrechen
                        </AlertDialogCancel>
                        <Button
                           type="submit"
                           variant="destructive"
                           disabled={isSubmitting || isPending}
                           className="cursor-pointer"
                           data-testid="submit-btn"
                        >
                           {submitBtnLabel()}
                        </Button>
                     </AlertDialogFooter>
                  </form>
               </Form>
            </AlertDialogContent>
         </AlertDialog>
      );
   };

   return (
      <div className="space-y-3" data-testid="delete-account-dialog">
         {blockedNotice()}
         {dialog()}
      </div>
   );
};
