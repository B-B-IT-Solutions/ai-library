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
         html: emailVerificationHtml(this.senderName, name, verificationUrl),
         text: emailVerificationText(this.senderName, name, verificationUrl),
      };
      await transporter.sendMail(mailOptions);
   }

   async sendPasswordResetEmail(
      params: PasswordResetEmailParams
   ): Promise<void> {
      const { to, name, resetUrl } = params;

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
         subject: `${this.senderName} – Passwort zurücksetzen`,
         html: passwordResetHtml(this.senderName, name, resetUrl),
         text: passwordResetText(this.senderName, name, resetUrl),
      };
      await transporter.sendMail(mailOptions);
   }
}
