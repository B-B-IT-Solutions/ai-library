"use client";

import { FC, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "es-toolkit/compat";
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
import { createCheckoutSession } from "@/data/actions/stripe/stripe.actions";
import { DCart } from "@/data/types/domain/cart";
import { DCheckoutForm } from "@/data/types/domain/order";
import { checkoutSchema } from "@/data/types/validators/order.schema";

type CheckoutFormProps = {
   cart: DCart;
};

export const CheckoutForm: FC<CheckoutFormProps> = ({ cart }) => {
   const [isPending, startTransition] = useTransition();

   const form = useForm<DCheckoutForm>({
      resolver: zodResolver(checkoutSchema),
      defaultValues: {
         agreeToTerms: false,
      },
   });

   const onSubmit = (data: DCheckoutForm) => {
      startTransition(async () => {
         const result = await createCheckoutSession();
         if (result.success && result.data) {
            // Redirect to Stripe Checkout
            window.location.href = result.data.url;
         } else {
            toast.error(result.message);
         }
      });
   };

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            data-testid="checkout-form"
         >
            <div className="space-y-4">
               <h3 className="text-lg font-semibold">Payment Information</h3>
               <p className="text-sm text-slate-600">
                  You will be redirected to Stripe to securely complete your
                  payment.
               </p>
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
               disabled={isPending || isEmpty(cart.items)}
               data-testid="place-order-btn"
            >
               {isPending ? "Redirecting to Stripe..." : "Proceed to Payment"}
            </Button>
         </form>
      </Form>
   );
};
