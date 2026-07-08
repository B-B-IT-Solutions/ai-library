"use client";

import { useState } from "react";

import { Button } from "@/components/shadcn/button";
import { Checkbox } from "@/components/shadcn/checkbox";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";

interface EmailGateStepProps {
   onSubmit: (email: string, firstName: string) => Promise<void>;
   isLoading: boolean;
}

export const EmailGateStep = ({ onSubmit, isLoading }: EmailGateStepProps) => {
   const [firstName, setFirstName] = useState("");
   const [email, setEmail] = useState("");
   const [consent, setConsent] = useState(false);
   const [emailError, setEmailError] = useState("");
   const [consentError, setConsentError] = useState("");

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setEmailError("");
      setConsentError("");

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailValid) {
         setEmailError("Bitte gib eine gültige E-Mail-Adresse ein.");
         return;
      }
      if (!consent) {
         setConsentError("Bitte bestätige, um dein Ergebnis zu erhalten.");
         return;
      }

      await onSubmit(email, firstName);
   };

   return (
      <div data-testid="email-gate-step">
         <h2 className="mb-2 text-center text-2xl font-bold text-slate-900">
            Fast geschafft!
         </h2>
         <p className="mb-8 text-center text-slate-600">
            Wohin dürfen wir dein persönliches Ergebnis schicken?
         </p>
         <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div>
               <Label htmlFor="firstName" className="mb-1.5 block text-sm">
                  Vorname (optional)
               </Label>
               <Input
                  id="firstName"
                  type="text"
                  placeholder="Wie dürfen wir dich nennen?"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  data-testid="firstname-input"
               />
            </div>
            <div>
               <Label htmlFor="email" className="mb-1.5 block text-sm">
                  E-Mail-Adresse
               </Label>
               <Input
                  id="email"
                  type="email"
                  placeholder="deine@email.de"
                  value={email}
                  onChange={(e) => {
                     setEmail(e.target.value);
                     setEmailError("");
                  }}
                  aria-invalid={!!emailError}
                  data-testid="email-input"
               />
               {emailError && (
                  <p className="mt-1 text-sm text-red-600" role="alert" data-testid="email-error">
                     {emailError}
                  </p>
               )}
            </div>
            <div className="flex items-start gap-3">
               <Checkbox
                  id="consent"
                  checked={consent}
                  onCheckedChange={(checked) => {
                     setConsent(checked === true);
                     setConsentError("");
                  }}
                  data-testid="consent-checkbox"
               />
               <Label htmlFor="consent" className="text-sm leading-relaxed text-slate-600">
                  Ich möchte gelegentlich Tipps zu KI-Produktivität per E-Mail
                  erhalten. Abmeldung jederzeit möglich.
               </Label>
            </div>
            {consentError && (
               <p className="text-sm text-red-600" role="alert" data-testid="consent-error">
                  {consentError}
               </p>
            )}
            <Button
               type="submit"
               size="lg"
               disabled={isLoading}
               className="mt-2 w-full"
               data-testid="submit-button"
            >
               {isLoading ? "Lädt …" : "Ergebnis anzeigen →"}
            </Button>
            <p className="text-center text-xs text-slate-400">
               Kein Spam. Deine Daten sind sicher.
            </p>
         </form>
      </div>
   );
};
