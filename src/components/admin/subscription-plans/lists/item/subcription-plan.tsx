"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
} from "@/components/shadcn/card";
import { Form } from "@/components/shadcn/form";
import {
   FormCheckBox,
   FormInput,
   FormTextArea,
} from "@/components/shared/widgets";
import { updateSubscriptionPlan } from "@/data/actions/admin/subscription-plans";
import { DSubscriptionPlanUpdate } from "@/data/types/domain/admin/subscription";
import { DSubscriptionPlan } from "@/data/types/domain/subscription";

type Props = {
   plan: DSubscriptionPlan;
};

export const SubscriptionPlan = ({ plan }: Props) => {
   const [isPending, startTransition] = useTransition();

   const form = useForm<DSubscriptionPlanUpdate>({
      defaultValues: {
         name: plan.name,
         description: plan.description,
         monthlyPrice: plan.monthlyPrice,
         yearlyPrice: plan.yearlyPrice,
         isActive: plan.isActive,
      },
   });

   const onSubmit = async (data: DSubscriptionPlanUpdate) => {
      startTransition(async () => {
         const result = await updateSubscriptionPlan(plan.id, data);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
      });
   };

   return (
      <Card data-testid="subscription-plan">
         <CardHeader>
            <CardTitle className="flex flex-col items-start space-y-2">
               <span>{plan.tier}</span>
               <span className="text-sm font-normal text-muted-foreground">
                  ID: {plan.id}
               </span>
            </CardTitle>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
               >
                  <FormInput<DSubscriptionPlanUpdate>
                     name="name"
                     label="Name"
                     required
                     control={form.control}
                  />

                  <FormTextArea<DSubscriptionPlanUpdate>
                     name="description"
                     label="Beschreibung"
                     rows={3}
                     control={form.control}
                  />

                  <div className="grid grid-cols-2 gap-4">
                     <FormInput<DSubscriptionPlanUpdate>
                        name="monthlyPrice"
                        label="Monatspreis (CHF)"
                        type="number"
                        control={form.control}
                     />
                     <FormInput<DSubscriptionPlanUpdate>
                        name="yearlyPrice"
                        label="Jahrespreis (CHF)"
                        type="number"
                        control={form.control}
                     />
                  </div>

                  <FormCheckBox<DSubscriptionPlanUpdate>
                     name="isActive"
                     label="Plan aktiv"
                     control={form.control}
                  />

                  <div className="space-y-2 rounded-md bg-muted/50 p-3">
                     <p className="text-xs font-medium text-muted-foreground">
                        Stripe-Konfiguration (readonly)
                     </p>
                     <div className="grid grid-cols-1 gap-2 text-xs">
                        <div>
                           <span className="font-medium">Product ID: </span>
                           <span className="font-mono">
                              {plan.stripeProductId ?? "—"}
                           </span>
                        </div>
                        <div>
                           <span className="font-medium">
                              Price ID (monatlich):{" "}
                           </span>
                           <span className="font-mono">
                              {plan.stripePriceIdMonthly ?? "—"}
                           </span>
                        </div>
                        <div>
                           <span className="font-medium">
                              Price ID (jährlich):{" "}
                           </span>
                           <span className="font-mono">
                              {plan.stripePriceIdYearly ?? "—"}
                           </span>
                        </div>
                     </div>
                  </div>

                  <Button
                     type="submit"
                     disabled={isPending}
                     className="cursor-pointer"
                  >
                     {isPending ? "Speichern..." : "Speichern"}
                  </Button>
               </form>
            </Form>
         </CardContent>
      </Card>
   );
};
