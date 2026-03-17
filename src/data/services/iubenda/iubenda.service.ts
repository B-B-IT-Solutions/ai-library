import axios from "axios";
import axiosRetry from "axios-retry";

import { DUser } from "@/data/types/domain/user";

const IUBENDA_CONSENT_URL = "https://consent.iubenda.com/consent";
const MAX_ATTEMPTS = 3;

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
   private client = axios.create();

   constructor(apiKey?: string) {
      this.apiKey = apiKey ?? process.env.IUBENDA_API_KEY;

      axiosRetry(this.client, {
         retries: MAX_ATTEMPTS - 1,
         retryDelay: axiosRetry.exponentialDelay,
         onRetry: (retryCount, error) => {
            console.warn(
               `[IubendaService] Attempt ${retryCount} failed, retrying:`,
               error.message
            );
         },
      });
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

      try {
         await this.client.post(
            IUBENDA_CONSENT_URL,
            this.buildLegalNoticesPayload(params),
            { headers: { ApiKey: this.apiKey } }
         );
         return true;
      } catch (error) {
         console.error(
            `[IubendaService] All ${MAX_ATTEMPTS} attempts failed for user ${params.user.id}:`,
            error
         );
         return false;
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
}
