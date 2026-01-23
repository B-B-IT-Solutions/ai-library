"use client";

import { FC, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "lucide-react";
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
import { updateUserProfile } from "@/data/actions/user";
import { DUser, DUserUpdateData } from "@/data/types/domain/user";
import { updateProfileSchema } from "@/data/types/validators/user";

type UserProfileProps = {
   user: DUser;
};

export const UserProfile: FC<UserProfileProps> = ({ user }) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const form = useForm<DUserUpdateData>({
      resolver: zodResolver(updateProfileSchema),
      defaultValues: {
         name: user.name,
      },
   });

   const { isSubmitting } = form.formState;

   const onSubmit: SubmitHandler<DUserUpdateData> = async (data) => {
      startTransition(async () => {
         const result = await updateUserProfile(user.id, data);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
         router.refresh();
      });
   };

   const submitBtnLabel = () => {
      if (isSubmitting || isPending) {
         return (
            <span className="flex items-center gap-2">
               <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
               Wird aktualisiert...
            </span>
         );
      }
      return "Aktualisieren";
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

   return (
      <Card data-testid="user-profile">
         <CardHeader>
            <CardTitle>Profil</CardTitle>
            <CardDescription>
               Verwalten Sie Ihre persönlichen Informationen
            </CardDescription>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
               >
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field, fieldState }) => (
                        <FormItem data-testid="name">
                           <FormLabel className="text-sm font-medium">
                              Name
                           </FormLabel>
                           <FormControl>
                              <div className="relative">
                                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <User className="h-4 w-4" />
                                 </div>
                                 <Input
                                    {...field}
                                    id="name"
                                    autoComplete="name"
                                    aria-invalid={fieldState.invalid}
                                    className="pl-10 h-11"
                                    data-testid="name-input"
                                 />
                              </div>
                           </FormControl>
                           <FormMessage data-testid="error-message" />
                        </FormItem>
                     )}
                  />

                  <FormItem data-testid="email">
                     <FormLabel className="text-sm font-medium">
                        E-Mail-Adresse
                     </FormLabel>
                     <FormControl>
                        <Input
                           value={user.email}
                           disabled
                           className="h-11 bg-muted cursor-not-allowed"
                        />
                     </FormControl>
                     <p className="text-xs text-muted-foreground">
                        Ihre E-Mail-Adresse kann nicht geändert werden
                     </p>
                  </FormItem>

                  <div className="flex justify-end">{submitBtn()}</div>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};
