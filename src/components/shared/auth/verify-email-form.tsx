"use client";

import { useState, useTransition } from "react";
import { Mail } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/shadcn/button";
import { resendVerificationEmail } from "@/data/actions/user";

type Props = {
   email?: string;
};

export const VerifyEmailForm = ({ email }: Props) => {
   const [isPending, startTransition] = useTransition();

   const [message, setMessage] = useState<{
      type: "success" | "error";
      text: string;
   } | null>(null);

   const handleResend = async () => {
      if (!email) {
         return;
      }

      startTransition(async () => {
         setMessage(null);

         const result = await resendVerificationEmail(email);
         setMessage({
            type: result.success ? "success" : "error",
            text: result.message,
         });
      });
   };

   const info = () => {
      if (email) {
         return (
            <p className="text-sm text-muted-foreground">
               Wir haben eine Bestätigungs-E-Mail an{" "}
               <span
                  className="font-medium text-foreground"
                  data-testid="email-display"
               >
                  {email}
               </span>{" "}
               gesendet. Klicke auf den Link in der E-Mail, um dein Konto zu
               aktivieren.
            </p>
         );
      }
      return (
         <p className="text-sm text-muted-foreground">
            Bitte überprüfe dein Postfach und klicke auf den Bestätigungslink.
         </p>
      );
   };

   const resendBtn = () => {
      if (email) {
         return (
            <Button
               variant="outline"
               className="w-full cursor-pointer"
               onClick={handleResend}
               disabled={isPending}
               data-testid="resend-btn"
            >
               {isPending ? (
                  <span className="flex items-center gap-2">
                     <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                     Wird gesendet...
                  </span>
               ) : (
                  "Erneut senden"
               )}
            </Button>
         );
      }
   };

   return (
      <div className="space-y-6 text-center" data-testid="verify-email-form">
         <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
               <Mail className="h-10 w-10 text-primary" />
            </div>
         </div>

         {info()}

         <p className="text-xs text-muted-foreground">
            Keine E-Mail erhalten? Prüfe deinen Spam-Ordner oder fordere eine
            neue E-Mail an.
         </p>

         {message && (
            <div
               className={`rounded-md border p-3 text-sm ${
                  message.type === "success"
                     ? "border-green-200 bg-green-50 text-green-700"
                     : "border-destructive/20 bg-destructive/10 text-destructive"
               }`}
               data-testid="resend-message"
            >
               {message.text}
            </div>
         )}

         {resendBtn()}

         <Link
            href="/auth/sign-in"
            target="_self"
            className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
            data-testid="sign-in-link"
         >
            Anmelden
         </Link>
      </div>
   );
};
