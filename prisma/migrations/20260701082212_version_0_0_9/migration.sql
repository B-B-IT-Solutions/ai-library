-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'PROMO_USER', 'ADMIN');

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

UPDATE "user"
SET "role" = "ADMIN"
WHERE "email" = "bobuskysergej@gmail.com";