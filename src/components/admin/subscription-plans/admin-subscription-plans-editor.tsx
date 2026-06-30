"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/shadcn/card";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { Textarea } from "@/components/shadcn/textarea";
import { updateSubscriptionPlan } from "@/data/actions/admin/subscription-plan.admin.actions";
import { DSubscriptionPlan } from "@/data/types/domain/subscription";

type Props = {
   plans: DSubscriptionPlan[];
};

type PlanFormValues = {
   name: string;
   description: string;
   monthlyPrice: number;
   yearlyPrice: number;
   isActive: boolean;
};

type PlanCardProps = {
   plan: DSubscriptionPlan;
};

const PlanCard = ({ plan }: PlanCardProps) => {
   const [isPending, setIsPending] = useState(false);

   const { register, handleSubmit, setValue, watch } = useForm<PlanFormValues>({
      defaultValues: {
         name: plan.name,
         description: plan.description,
         monthlyPrice: plan.monthlyPrice,
         yearlyPrice: plan.yearlyPrice,
         isActive: plan.isActive,
      },
   });

   const isActive = watch("isActive");

   const onSubmit = async (data: PlanFormValues) => {
      setIsPending(true);
      try {
         const result = await updateSubscriptionPlan(plan.id, data);
         if (result.success) {
            toast.success(result.message);
         } else {
            toast.error(result.message);
         }
      } finally {
         setIsPending(false);
      }
   };

   return (
      <Card data-testid={`plan-card-${plan.tier}`}>
         <CardHeader>
            <CardTitle className="flex items-center justify-between">
               <span>{plan.tier}</span>
               <span className="text-sm font-normal text-muted-foreground">ID: {plan.id}</span>
            </CardTitle>
         </CardHeader>
         <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor={`name-${plan.id}`}>Name</Label>
                  <Input
                     id={`name-${plan.id}`}
                     {...register("name", { required: true })}
                     disabled={isPending}
                  />
               </div>

               <div className="space-y-2">
                  <Label htmlFor={`description-${plan.id}`}>Beschreibung</Label>
                  <Textarea
                     id={`description-${plan.id}`}
                     {...register("description")}
                     rows={3}
                     disabled={isPending}
                  />
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label htmlFor={`monthlyPrice-${plan.id}`}>Monatspreis (CHF)</Label>
                     <Input
                        id={`monthlyPrice-${plan.id}`}
                        type="number"
                        step="0.01"
                        {...register("monthlyPrice", { valueAsNumber: true })}
                        disabled={isPending}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor={`yearlyPrice-${plan.id}`}>Jahrespreis (CHF)</Label>
                     <Input
                        id={`yearlyPrice-${plan.id}`}
                        type="number"
                        step="0.01"
                        {...register("yearlyPrice", { valueAsNumber: true })}
                        disabled={isPending}
                     />
                  </div>
               </div>

               <div className="flex items-center gap-2">
                  <Checkbox
                     id={`isActive-${plan.id}`}
                     checked={isActive}
                     onCheckedChange={(checked) => setValue("isActive", !!checked)}
                     disabled={isPending}
                  />
                  <Label htmlFor={`isActive-${plan.id}`}>Plan aktiv</Label>
               </div>

               {/* Readonly Stripe IDs */}
               <div className="rounded-md bg-muted/50 p-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Stripe-Konfiguration (readonly)</p>
                  <div className="grid grid-cols-1 gap-2 text-xs">
                     <div>
                        <span className="font-medium">Product ID: </span>
                        <span className="font-mono">{plan.stripeProductId ?? "—"}</span>
                     </div>
                     <div>
                        <span className="font-medium">Price ID (monatlich): </span>
                        <span className="font-mono">{plan.stripePriceIdMonthly ?? "—"}</span>
                     </div>
                     <div>
                        <span className="font-medium">Price ID (jährlich): </span>
                        <span className="font-mono">{plan.stripePriceIdYearly ?? "—"}</span>
                     </div>
                  </div>
               </div>

               <Button type="submit" disabled={isPending}>
                  {isPending ? "Speichern..." : "Speichern"}
               </Button>
            </form>
         </CardContent>
      </Card>
   );
};

export const AdminSubscriptionPlansEditor = ({ plans }: Props) => {
   return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3" data-testid="admin-subscription-plans-editor">
         {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
         ))}
      </div>
   );
};
