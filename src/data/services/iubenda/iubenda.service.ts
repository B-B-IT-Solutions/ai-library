type IubendaConsentPayload = {
   subject: {
      id: string;
      email: string;
      full_name?: string;
   };
   legal_notices: { identifier: string }[];
   proofs: { content: string; form: string }[];
   timestamp: string;
};

export type RecordConsentParams = {
   userId: string;
   email: string;
   fullName: string;
   consentAcceptedAt: Date;
};

export class IubendaService {
   private apiKey: string | undefined;

   constructor(apiKey?: string) {
      this.apiKey = apiKey ?? process.env.IUBENDA_API_KEY;
   }

   async recordConsent(params: RecordConsentParams): Promise<void> {
      if (!this.apiKey) {
         console.warn(
            "[IubendaService] IUBENDA_API_KEY not set – skipping consent recording"
         );
         return;
      }

      const payload: IubendaConsentPayload = {
         subject: {
            id: params.userId,
            email: params.email,
            full_name: params.fullName,
         },
         legal_notices: [
            { identifier: "privacy_policy" },
            { identifier: "terms_and_conditions" },
         ],
         proofs: [
            {
               content: JSON.stringify({
                  action: "registration",
                  source: "signup_form",
                  accepted_at: params.consentAcceptedAt.toISOString(),
               }),
               form: "Registrierungsformular – Checkbox: AGB und Datenschutzerklärung",
            },
         ],
         timestamp: params.consentAcceptedAt.toISOString(),
      };

      const response = await fetch("https://consent.iubenda.com/consent", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            ApiKey: this.apiKey,
         },
         body: JSON.stringify(payload),
      });

      if (!response.ok) {
         const body = await response.text();
         throw new Error(
            `[IubendaService] Consent recording failed (${response.status}): ${body}`
         );
      }
   }
}
