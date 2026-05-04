import { VerificationTokenRepository } from "@/data/repositories/user";
import { EmailVerificationParams, IEmailService } from "@/data/services/email";
import { APP_URL } from "@/lib/constants";

export class VerificationTokenService {
   constructor(
      private readonly tokenRepo: VerificationTokenRepository,
      private readonly emailService: IEmailService
   ) {}

   async sendVerificationEmail(email: string, name: string): Promise<void> {
      const token = await this.tokenRepo.pCreateToken(email);
      const verificationUrl = `${APP_URL}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

      const params: EmailVerificationParams = {
         to: email,
         name,
         verificationUrl,
      };
      await this.emailService.sendVerificationEmail(params);
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
