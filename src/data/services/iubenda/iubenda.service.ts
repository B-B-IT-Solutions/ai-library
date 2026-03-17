import { DUser } from "@/data/types/domain/user";

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

export type LegalNoticesAcceptedParams = {
   user: DUser;
   acceptedAt: Date;
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
   async saveLegalNoticesAccepted(
      params: LegalNoticesAcceptedParams
   ): Promise<boolean> {
      if (!this.apiKey) {
         console.warn(
            "[IubendaService] IUBENDA_API_KEY not set – skipping consent recording"
         );
         return false;
      }

      const payload = this.buildLegalNoticesPayload(params);

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
                  `[IubendaService] All ${MAX_ATTEMPTS} attempts failed for user ${params.user.id}:`,
                  error
               );
            } else {
               console.warn(
                  `[IubendaService] Attempt ${attempt} failed for user ${params.user.id}, retrying in ${RETRY_DELAYS_MS[attempt]}ms:`,
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

   private buildLegalNoticesPayload(
      params: LegalNoticesAcceptedParams
   ): IubendaConsentPayload {
      const { user, acceptedAt } = params;
      return {
         subject: {
            id: user.id,
            email: user.email,
            full_name: user.name,
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
                  accepted_at: acceptedAt.toISOString(),
               }),
               form: "Registrierungsformular – Checkbox: AGB und Datenschutzerklärung",
            },
         ],
         timestamp: acceptedAt.toISOString(),
      };
   }

   private sleep(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
   }
}
