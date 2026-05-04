import { DbClient } from "@/data/types/db/common";
import { DVerificationToken } from "@/data/types/domain/user";
import {
   VerificationTokenCreateArgs,
   VerificationTokenDeleteArgs,
   VerificationTokenDeleteManyArgs,
   VerificationTokenFindUniqueArgs,
} from "@/generated/prisma/models";

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

      const deleteArgs = {
         where: {
            identifier: email,
         },
      } satisfies VerificationTokenDeleteManyArgs;
      await this.prisma.verificationToken.deleteMany(deleteArgs);

      const createArgs = {
         data: {
            identifier: email,
            token,
            expires,
         },
      } satisfies VerificationTokenCreateArgs;
      await this.prisma.verificationToken.create(createArgs);

      return token;
   }

   async pGetToken(
      email: string,
      token: string
   ): Promise<DVerificationToken | null> {
      const args = {
         where: { identifier_token: { identifier: email, token } },
      } satisfies VerificationTokenFindUniqueArgs;

      return await this.prisma.verificationToken.findUnique(args);
   }

   async pDeleteToken(email: string, token: string) {
      const deleteArgs = {
         where: { identifier_token: { identifier: email, token } },
      } satisfies VerificationTokenDeleteArgs;

      await this.prisma.verificationToken.delete(deleteArgs);
   }
}
