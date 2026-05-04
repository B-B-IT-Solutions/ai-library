import nodemailer from "nodemailer";

import { APP_NAME, getSmtpFrom, getSmtpHost, getSmtpPort } from "@/lib/constants";

import type { IEmailService } from "./email.service.interface";
import type { EmailVerificationParams } from "./types";

export class SmtpEmailService implements IEmailService {
   private senderName: string;
   private senderEmail: string;

   constructor() {
      this.senderName = APP_NAME;
      this.senderEmail = getSmtpFrom();
   }

   async sendVerificationEmail(params: EmailVerificationParams): Promise<void> {
      const { to, name, verificationUrl } = params;

      const transporter = nodemailer.createTransport({
         host: getSmtpHost(),
         port: getSmtpPort(),
         secure: false,
         auth: undefined,
      });

      await transporter.sendMail({
         from: `"${this.senderName}" <${this.senderEmail}>`,
         to,
         subject: `${this.senderName} – E-Mail-Adresse bestätigen`,
         html: this.buildHtml(name, verificationUrl),
         text: this.buildText(name, verificationUrl),
      });
   }

   private buildHtml(name: string, url: string): string {
      return `<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
  <h2>Hallo ${name},</h2>
  <p>Willkommen bei ${this.senderName}! Bitte bestätige deine E-Mail-Adresse, um dein Konto zu aktivieren.</p>
  <p style="margin:32px 0">
    <a href="${url}" style="background:#000;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold">
      E-Mail bestätigen
    </a>
  </p>
  <p style="color:#666;font-size:14px">Dieser Link ist 24 Stunden gültig.</p>
  <p style="color:#666;font-size:14px">Falls du kein Konto bei ${this.senderName} erstellt hast, kannst du diese E-Mail ignorieren.</p>
</body>
</html>`;
   }

   private buildText(name: string, url: string): string {
      return `Hallo ${name},\n\nWillkommen bei ${this.senderName}! Bitte bestätige deine E-Mail-Adresse:\n\n${url}\n\nDieser Link ist 24 Stunden gültig.\n\nFalls du kein Konto erstellt hast, kannst du diese E-Mail ignorieren.`;
   }
}
