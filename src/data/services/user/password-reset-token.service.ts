import { PasswordResetTokenRepository } from "@/data/repositories/user";
import { IEmailService, PasswordResetEmailParams } from "@/data/services/email";
import { APP_URL } from "@/lib/constants";

export class PasswordResetTokenService {
   constructor(
      private readonly tokenRepo: PasswordResetTokenRepository,
      private readonly emailService: IEmailService
   ) {}

   async sendPasswordResetEmail(email: string, name: string): Promise<void> {
      const token = await this.tokenRepo.pCreateToken(email);
      const resetUrl = `${APP_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

      const params: PasswordResetEmailParams = { to: email, name, resetUrl };
      await this.emailService.sendPasswordResetEmail(params);
   }

   async verifyToken(email: string, token: string): Promise<boolean> {
      const record = await this.tokenRepo.pGetToken(email, token);

      if (!record) {
         return false;
      }

      if (record.expires < new Date()) {
         await this.tokenRepo.pDeleteToken(email, token);
         return false;
      }

      return true;
   }

   async consumeToken(email: string, token: string): Promise<boolean> {
      const valid = await this.verifyToken(email, token);
      if (!valid) return false;

      await this.tokenRepo.pDeleteToken(email, token);
      return true;
   }
}
