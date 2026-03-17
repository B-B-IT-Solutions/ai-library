-- AlterTable
ALTER TABLE "user" ADD COLUMN     "iubenda_legal_notices_synced" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "legal_notices_accepted_at" TIMESTAMP(6);
