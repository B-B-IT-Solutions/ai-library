"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
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
   Field,
   FieldError,
   FieldGroup,
   FieldLabel,
} from "@/components/shadcn/field";
import { Input } from "@/components/shadcn/input";
import { deleteAccount } from "@/data/actions/user/settings.actions";
import { deleteAccountSchema } from "@/data/types/validators/user";

type DeleteAccountFormData = {
   password: string;
};

export const DeleteAcount = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [isPending, startTransition] = useTransition();
   const [showPassword, setShowPassword] = useState(false);

   const {
      handleSubmit,
      formState: { isSubmitting },
      control,
      reset,
   } = useForm<DeleteAccountFormData>({
      resolver: zodResolver(deleteAccountSchema),
      defaultValues: {
         password: "",
      },
   });

   const onSubmit: SubmitHandler<DeleteAccountFormData> = async (data) => {
      startTransition(async () => {
         const result = await deleteAccount(data.password);
         if (result.success) {
            toast.success(result.message);
            setIsOpen(false);
            // User will be redirected to /p by the action
         } else {
            toast.error(result.message);
         }
      });
   };

   const handleCancel = () => {
      setIsOpen(false);
      reset();
      setShowPassword(false);
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
            <div className="space-y-4">
               <div>
                  <h3 className="text-sm font-medium mb-1">Konto löschen</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                     Löschen Sie Ihr Konto dauerhaft und alle zugehörigen Daten.
                     Diese Aktion kann nicht rückgängig gemacht werden.
                  </p>
                  <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                     <AlertDialogTrigger asChild={true}>
                        <Button
                           variant="destructive"
                           className="cursor-pointer"
                        >
                           Konto löschen
                        </Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                           <AlertDialogHeader>
                              <AlertDialogTitle>
                                 Sind Sie absolut sicher?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="space-y-3">
                                 <div>
                                    Diese Aktion kann nicht rückgängig gemacht
                                    werden. Ihr Konto, alle Bestellungen und
                                    Bibliothekseinträge werden dauerhaft
                                    gelöscht.
                                 </div>
                                 <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                                    <p className="text-sm font-medium text-destructive">
                                       Warnung: Dies ist eine dauerhafte
                                       Löschung!
                                    </p>
                                 </div>
                              </AlertDialogDescription>
                           </AlertDialogHeader>

                           <div className="my-4">
                              <FieldGroup>
                                 <Controller
                                    name="password"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                       <Field data-invalid={fieldState.invalid}>
                                          <FieldLabel
                                             htmlFor="delete-password"
                                             className="text-sm font-medium"
                                          >
                                             Geben Sie Ihr Passwort ein, um zu
                                             bestätigen
                                          </FieldLabel>
                                          <div className="relative">
                                             <Input
                                                {...field}
                                                id="delete-password"
                                                type={
                                                   showPassword
                                                      ? "text"
                                                      : "password"
                                                }
                                                autoComplete="current-password"
                                                placeholder="Passwort eingeben"
                                                aria-invalid={
                                                   fieldState.invalid
                                                }
                                                className="pr-10 h-11"
                                             />
                                             <button
                                                type="button"
                                                onClick={() =>
                                                   setShowPassword(
                                                      !showPassword
                                                   )
                                                }
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded p-0.5"
                                                aria-label={
                                                   showPassword
                                                      ? "Passwort verbergen"
                                                      : "Passwort anzeigen"
                                                }
                                             >
                                                {showPassword ? (
                                                   <EyeOff className="h-4 w-4" />
                                                ) : (
                                                   <Eye className="h-4 w-4" />
                                                )}
                                             </button>
                                          </div>
                                          {fieldState.invalid && (
                                             <FieldError
                                                errors={[fieldState.error]}
                                             />
                                          )}
                                       </Field>
                                    )}
                                 />
                              </FieldGroup>
                           </div>

                           <AlertDialogFooter>
                              <AlertDialogCancel
                                 type="button"
                                 onClick={handleCancel}
                                 disabled={isSubmitting || isPending}
                              >
                                 Abbrechen
                              </AlertDialogCancel>
                              <Button
                                 type="submit"
                                 variant="destructive"
                                 disabled={isSubmitting || isPending}
                                 className="cursor-pointer"
                              >
                                 {isSubmitting || isPending ? (
                                    <span className="flex items-center gap-2">
                                       <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                       Wird gelöscht...
                                    </span>
                                 ) : (
                                    "Konto dauerhaft löschen"
                                 )}
                              </Button>
                           </AlertDialogFooter>
                        </form>
                     </AlertDialogContent>
                  </AlertDialog>
               </div>
            </div>
         </CardContent>
      </Card>
   );
};
