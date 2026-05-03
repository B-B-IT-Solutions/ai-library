import { VerificationTokenRepository } from "@/data/repositories/verification-token";
import { BrevoEmailService } from "@/data/services/email";
import { APP_URL } from "@/lib/constants";

export class VerificationTokenService {
   constructor(
      private readonly tokenRepo: VerificationTokenRepository,
      private readonly emailService: BrevoEmailService
   ) {}

   async sendVerificationEmail(
      email: string,
      name: string
   ): Promise<void> {
      const token = await this.tokenRepo.pCreateToken(email);
      const verificationUrl = `${APP_URL}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

      await this.emailService.sendVerificationEmail({
         to: email,
         name,
         verificationUrl,
      });
   }

   async verifyToken(email: string, token: string): Promise<boolean> {
      const record = await this.tokenRepo.pFindToken(email, token);

      if (!record) {
         return false;
      }

      if (record.expires < new Date()) {
         await this.tokenRepo.pDeleteToken(email, token);
         return false;
      }

      await this.tokenRepo.pDeleteToken(email, token);
      return true;
   }
}
