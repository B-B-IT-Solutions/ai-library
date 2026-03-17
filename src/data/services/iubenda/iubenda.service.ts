const IUBENDA_CONSENT_URL = "https://consent.iubenda.com/consent";
const MAX_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [0, 1_000, 2_000];

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

   /**
    * Records consent in iubenda with up to 3 attempts (exponential backoff).
    * @returns true if consent was successfully recorded, false if all attempts failed.
    */
   async recordConsent(params: RecordConsentParams): Promise<boolean> {
      if (!this.apiKey) {
         console.warn(
            "[IubendaService] IUBENDA_API_KEY not set – skipping consent recording"
         );
         return false;
      }

      const payload = this.buildPayload(params);

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
         const delayMs = RETRY_DELAYS_MS[attempt - 1];
         if (delayMs > 0) {
            await this.sleep(delayMs);
         }

         try {
            await this.postConsent(payload);
            return true;
         } catch (error) {
            const isLastAttempt = attempt === MAX_ATTEMPTS;
            if (isLastAttempt) {
               console.error(
                  `[IubendaService] All ${MAX_ATTEMPTS} attempts failed for user ${params.userId}:`,
                  error
               );
            } else {
               console.warn(
                  `[IubendaService] Attempt ${attempt} failed for user ${params.userId}, retrying in ${RETRY_DELAYS_MS[attempt]}ms:`,
                  error
               );
            }
         }
      }

      return false;
   }

   private async postConsent(payload: IubendaConsentPayload): Promise<void> {
      const response = await fetch(IUBENDA_CONSENT_URL, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            ApiKey: this.apiKey!,
         },
         body: JSON.stringify(payload),
      });

      if (!response.ok) {
         const body = await response.text();
         throw new Error(`HTTP ${response.status}: ${body}`);
      }
   }

   private buildPayload(params: RecordConsentParams): IubendaConsentPayload {
      return {
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
   }

   private sleep(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
   }
}
