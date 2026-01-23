"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
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
import { deleteAccount } from "@/data/actions/user";
import { DUserAccountDelete } from "@/data/types/domain/user";
import { deleteAccountSchema } from "@/data/types/validators/user";

export const DeleteAcount = () => {
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
         const result = await deleteAccount(data);
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

   const dialog = () => {
      return (
         <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild={true}>
               <Button
                  variant="destructive"
                  className="cursor-pointer"
                  data-testid="delete-btn"
               >
                  Konto löschen
               </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                     <AlertDialogHeader>
                        <AlertDialogTitle>
                           Sind Sie absolut sicher?
                        </AlertDialogTitle>
                        <AlertDialogDescription asChild={true}>
                           <div className="space-y-3">
                              <p>
                                 Diese Aktion kann nicht rückgängig gemacht
                                 werden. Ihr Konto, alle Bestellungen und
                                 Bibliothekseinträge werden dauerhaft gelöscht.
                              </p>
                              <p className="bg-destructive/10 border border-destructive/20 rounded-md p-3 text-sm font-medium text-destructive">
                                 Warnung: Dies ist eine dauerhafte Löschung!
                              </p>
                           </div>
                        </AlertDialogDescription>
                     </AlertDialogHeader>
                     <div className="my-4">
                        <FormField
                           control={form.control}
                           name="password"
                           render={({ field, fieldState }) => (
                              <FormItem data-testid="password">
                                 <FormLabel className="text-sm font-medium">
                                    Geben Sie Ihr Passwort ein, um zu bestätigen
                                 </FormLabel>
                                 <FormControl>
                                    <div className="relative">
                                       <Input
                                          {...field}
                                          id="delete-password"
                                          type={inputType(showPassword)}
                                          autoComplete="current-password"
                                          placeholder="Passwort eingeben"
                                          aria-invalid={fieldState.invalid}
                                          className="pr-10 h-11"
                                          data-testid="password-input"
                                       />
                                       <button
                                          type="button"
                                          onClick={toggleShowPassword}
                                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded p-0.5"
                                          aria-label={inputAriaLabel(
                                             showPassword
                                          )}
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
                     </div>

                     <AlertDialogFooter>
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
      <Card className="border-destructive" data-testid="delete-account">
         <CardHeader>
            <div className="flex items-center gap-2">
               <AlertTriangle className="h-5 w-5 text-destructive" />
               <CardTitle className="text-destructive">
                  Gefahrenbereich
               </CardTitle>
            </div>
            <CardDescription>Dauerhafte Aktionen für Ihr Konto</CardDescription>
         </CardHeader>
         <CardContent>
            <div>
               <h3 className="text-sm font-medium mb-1">Konto löschen</h3>
               <p className="text-sm text-muted-foreground mb-4">
                  Löschen Sie Ihr Konto dauerhaft und alle zugehörigen Daten.
                  Diese Aktion kann nicht rückgängig gemacht werden.
               </p>
               {dialog()}
            </div>
         </CardContent>
      </Card>
   );
};
