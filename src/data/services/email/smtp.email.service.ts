import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import {
   APP_NAME,
   getSmtpFrom,
   getSmtpHost,
   getSmtpPort,
} from "@/lib/constants";

import type { IEmailService } from "./email.service.interface";
import type { EmailVerificationParams } from "./types";
import { buildHtml, buildText } from "./utils";

export class SmtpEmailService implements IEmailService {
   private senderName: string;
   private senderEmail: string;

   constructor() {
      this.senderName = APP_NAME;
      this.senderEmail = getSmtpFrom();
   }

   async sendVerificationEmail(params: EmailVerificationParams): Promise<void> {
      const { to, name, verificationUrl } = params;

      const transportOptions: SMTPTransport.Options = {
         host: getSmtpHost(),
         port: getSmtpPort(),
         secure: false,
         auth: undefined,
      };
      const transporter = nodemailer.createTransport(transportOptions);

      const mailOptions: Mail.Options = {
         from: `"${this.senderName}" <${this.senderEmail}>`,
         to,
         subject: `${this.senderName} – E-Mail-Adresse bestätigen`,
         html: buildHtml(this.senderName, name, verificationUrl),
         text: buildText(this.senderName, name, verificationUrl),
      };
      await transporter.sendMail(mailOptions);
   }
}
