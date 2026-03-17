-- AlterTable
ALTER TABLE "user" ADD COLUMN "consent_accepted_at" TIMESTAMP(6),
                   ADD COLUMN "iubenda_consent_synced" BOOLEAN NOT NULL DEFAULT false;
