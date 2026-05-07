import { Brevo, BrevoClient } from "@getbrevo/brevo";

import { APP_NAME, getBrevoApiKey, getBrevoSenderEmail } from "@/lib/constants";

import type { IEmailService } from "./email.service.interface";
import type {
   EmailVerificationParams,
   PasswordResetEmailParams,
} from "./types";
import {
   emailVerificationHtml,
   emailVerificationText,
   passwordResetHtml,
   passwordResetText,
} from "./utils";

export class BrevoEmailService implements IEmailService {
   private client: BrevoClient;
   private senderEmail: string;
   private senderName: string;

   constructor() {
      this.client = new BrevoClient({ apiKey: getBrevoApiKey() });
      this.senderEmail = getBrevoSenderEmail();
      this.senderName = APP_NAME;
   }

   async sendVerificationEmail(params: EmailVerificationParams): Promise<void> {
      const { to, name, verificationUrl } = params;

      const request: Brevo.SendTransacEmailRequest = {
         to: [
            {
               email: to,
               name,
            },
         ],
         sender: {
            email: this.senderEmail,
            name: this.senderName,
         },
         subject: `${this.senderName} – E-Mail-Adresse bestätigen`,
         htmlContent: emailVerificationHtml(
            this.senderName,
            name,
            verificationUrl
         ),
         textContent: emailVerificationText(
            this.senderName,
            name,
            verificationUrl
         ),
      };

      try {
         await this.client.transactionalEmails.sendTransacEmail(request);
      } catch (error) {
         console.error(error);
      }
   }

   async sendPasswordResetEmail(
      params: PasswordResetEmailParams
   ): Promise<void> {
      const { to, name, resetUrl } = params;

      const request: Brevo.SendTransacEmailRequest = {
         to: [{ email: to, name }],
         sender: {
            email: this.senderEmail,
            name: this.senderName,
         },
         subject: `${this.senderName} – Passwort zurücksetzen`,
         htmlContent: passwordResetHtml(this.senderName, name, resetUrl),
         textContent: passwordResetText(this.senderName, name, resetUrl),
      };

      try {
         await this.client.transactionalEmails.sendTransacEmail(request);
      } catch (error) {
         console.error(error);
      }
   }
}
