import nodemailer from "nodemailer";

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
         html: buildHtml(name, verificationUrl),
         text: buildText(name, verificationUrl),
      });
   }
}
