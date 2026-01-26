"use client";

import { FC, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "es-toolkit/compat";
import { Loader } from "lucide-react";
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
import { createOrderCheckoutSession } from "@/data/actions/stripe";
import { DCart } from "@/data/types/domain/cart";
import { DCheckoutForm } from "@/data/types/domain/checkout";
import { checkoutSchema } from "@/data/types/validators/checkout.schema";
import { navigateToExternalUrl } from "@/lib/utils";

type CheckoutFormProps = {
   cart: DCart;
};

export const CheckoutForm: FC<CheckoutFormProps> = ({ cart }) => {
   const [isSubmitted, setSubmited] = useState<boolean>(false);
   const [, startTransition] = useTransition();

   const form = useForm<DCheckoutForm>({
      resolver: zodResolver(checkoutSchema),
      defaultValues: {
         agreeToTerms: false,
      },
   });

   const onSubmit = (data: DCheckoutForm) => {
      startTransition(async () => {
         setSubmited(true);
         const result = await createOrderCheckoutSession();
         if (result.success && result.data) {
            // Redirect to Stripe Checkout
            navigateToExternalUrl(result.data.url);
         } else {
            setSubmited(false);
            toast.error(result.message);
         }
      });
   };

   const btnIcon = () => {
      if (isSubmitted) {
         return <Loader className="h-4 w-4 animate-spin" />;
      }
   };

   const btnText = () => {
      return isSubmitted ? "Weiterleitung zu Stripe..." : "Zur Zahlung";
   };

   return (
      <Form {...form}>
         <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
            data-testid="checkout-form"
         >
            <div className="space-y-4">
               <h3 className="text-lg font-semibold">Zahlungsinformationen</h3>
               <p className="text-sm text-slate-600">
                  Sie werden zu Stripe weitergeleitet, um Ihre Zahlung sicher
                  abzuschließen.
               </p>
            </div>

            <div className="border-t pt-4">
               <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                     <FormItem className="flex flex-row items-start space-y-0 space-x-3">
                        <FormControl>
                           <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="terms-checkbox"
                           />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                           <FormLabel>
                              Ich stimme den Allgemeinen Geschäftsbedingungen zu
                           </FormLabel>
                           <FormMessage data-testid="error-message" />
                        </div>
                     </FormItem>
                  )}
               />
            </div>

            <Button
               type="submit"
               className="w-full cursor-pointer"
               disabled={isSubmitted || isEmpty(cart.items)}
               data-testid="proceed-to-payment-btn"
            >
               {btnIcon()}
               {btnText()}
            </Button>
         </form>
      </Form>
   );
};
