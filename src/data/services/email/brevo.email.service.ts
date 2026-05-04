import { Brevo, BrevoClient } from "@getbrevo/brevo";

import { APP_NAME, getBrevoApiKey, getBrevoSenderEmail } from "@/lib/constants";

import type { IEmailService } from "./email.service.interface";
import type { EmailVerificationParams } from "./types";
import { buildHtml, buildText } from "./utils";

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
         htmlContent: buildHtml(this.senderName, name, verificationUrl),
         textContent: buildText(this.senderName, name, verificationUrl),
      };

      await this.client.transactionalEmails.sendTransacEmail(request);
   }
}
