import { DbClient } from "@/data/types/db/common";

const TOKEN_EXPIRY_HOURS = 24;

export class VerificationTokenRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pCreateToken(email: string): Promise<string> {
      const token = crypto.randomUUID();
      const expires = new Date(
         Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
      );

      await this.prisma.verificationToken.deleteMany({
         where: { identifier: email },
      });

      await this.prisma.verificationToken.create({
         data: { identifier: email, token, expires },
      });

      return token;
   }

   async pFindToken(email: string, token: string) {
      return await this.prisma.verificationToken.findUnique({
         where: { identifier_token: { identifier: email, token } },
      });
   }

   async pDeleteToken(email: string, token: string) {
      await this.prisma.verificationToken.delete({
         where: { identifier_token: { identifier: email, token } },
      });
   }
}
