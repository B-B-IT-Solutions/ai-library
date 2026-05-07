import { DbClient } from "@/data/types/db/common";
import { DVerificationToken } from "@/data/types/domain/user";
import {
   PasswordResetTokenCreateArgs,
   PasswordResetTokenDeleteArgs,
   PasswordResetTokenDeleteManyArgs,
   PasswordResetTokenFindUniqueArgs,
} from "@/generated/prisma/models";

const TOKEN_EXPIRY_HOURS = 1;

export class PasswordResetRepository {
   private prisma: DbClient;

   constructor(prisma: DbClient) {
      this.prisma = prisma;
   }

   async pGetToken(
      email: string,
      token: string
   ): Promise<DVerificationToken | null> {
      const args = {
         where: {
            identifier_token: {
               identifier: email,
               token,
            },
         },
      } satisfies PasswordResetTokenFindUniqueArgs;

      return await this.prisma.passwordResetToken.findUnique(args);
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
      } satisfies PasswordResetTokenDeleteManyArgs;
      await this.prisma.passwordResetToken.deleteMany(deleteArgs);

      const createArgs = {
         data: {
            identifier: email,
            token,
            expires,
         },
      } satisfies PasswordResetTokenCreateArgs;
      await this.prisma.passwordResetToken.create(createArgs);

      return token;
   }

   async pDeleteToken(email: string, token: string): Promise<void> {
      const deleteArgs = {
         where: {
            identifier_token: {
               identifier: email,
               token,
            },
         },
      } satisfies PasswordResetTokenDeleteArgs;

      await this.prisma.passwordResetToken.delete(deleteArgs);
   }
}
