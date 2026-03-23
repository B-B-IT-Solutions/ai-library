import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import axiosRetry from "axios-retry";

import { getIubendaApiKey, getIubendaConsentUrl } from "@/lib/constants";

import { IubendaConsentPayload, LegalNoticesAcceptedParams } from "./types";

const RETRY_COUNTS = 3;

export class IubendaService {
   private apiKey: string;
   private consentUrl: string;
   private axios: AxiosInstance;

   constructor() {
      this.apiKey = getIubendaApiKey();
      this.consentUrl = getIubendaConsentUrl();

      this.axios = axios.create({
         baseURL: this.consentUrl,
      });

      axiosRetry(this.axios, {
         retries: RETRY_COUNTS - 1,
         retryDelay: axiosRetry.exponentialDelay,
         onRetry: (retryCount, error) => {
            console.warn(
               `[IubendaService] Attempt ${retryCount} failed, retrying:`,
               error.message
            );
         },
      });
   }

   async saveLegalNoticesAccepted(
      params: LegalNoticesAcceptedParams
   ): Promise<boolean> {
      try {
         const payload = this.buildLegalNoticesPayload(params);
         const config: AxiosRequestConfig = {
            headers: {
               ApiKey: this.apiKey,
            },
         };
         await this.axios.post("/consent", payload, config);

         return true;
      } catch (error) {
         let data = error;
         if (error instanceof AxiosError) {
            data = {
               message: error.message,
               status: error.response?.status,
               data: error.response?.data,
            };
         }
         console.error(
            `[IubendaService] All attempts to save legal notices failed for user ${params.user.id}:`,
            data
         );
         return false;
      }
   }

   private buildLegalNoticesPayload(
      params: LegalNoticesAcceptedParams
   ): IubendaConsentPayload {
      const { user, acceptedAt, ipAddress } = params;
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
         ip_address: ipAddress,
         timestamp: acceptedAt.toISOString(),
      };
   }
}
