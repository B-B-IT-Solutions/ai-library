"use client";

import { FC, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/shadcn/form";
import { Input } from "@/components/shadcn/input";
import { createOrder } from "@/data/actions/order/order.actions";
import { DCart } from "@/data/types/domain/cart";
import { DCheckoutForm } from "@/data/types/domain/order";
import { checkoutSchema } from "@/data/types/validators/order.schema";

type CheckoutFormProps = {
   cart: DCart;
};

export const CheckoutForm: FC<CheckoutFormProps> = ({ cart }) => {
   const router = useRouter();
   const [isPending, startTransition] = useTransition();

   const form = useForm<DCheckoutForm>({
      resolver: zodResolver(checkoutSchema),
      defaultValues: {
         paymentMethodId: "",
         agreeToTerms: false,
      },
   });

   const onSubmit = (data: DCheckoutForm) => {
      startTransition(async () => {
         const result = await createOrder(data.paymentMethodId || undefined);
         if (result.success && result.data) {
            toast.success(result.message);
            router.push(`/orders/${result.data.id}`);
         } else {
            toast.error(result.message);
         }
      });
   };

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
               <h3 className="text-lg font-semibold">Payment Information</h3>
               <p className="text-sm text-slate-600">
                  Payment method is stored for reference only. No actual payment
                  processing is implemented.
               </p>

               <FormField
                  control={form.control}
                  name="paymentMethodId"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel>Payment Method ID (Optional)</FormLabel>
                        <FormControl>
                           <Input
                              placeholder="e.g., pm_1234567890"
                              {...field}
                              data-testid="payment-method-input"
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </div>

            <div className="border-t pt-4">
               <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                     <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                           <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="terms-checkbox"
                           />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                           <FormLabel>
                              I agree to the terms and conditions
                           </FormLabel>
                           <FormMessage />
                        </div>
                     </FormItem>
                  )}
               />
            </div>

            <Button
               type="submit"
               className="w-full"
               disabled={isPending || cart.items.length === 0}
               data-testid="place-order-button"
            >
               {isPending ? "Placing Order..." : "Place Order"}
            </Button>
         </form>
      </Form>
   );
};
