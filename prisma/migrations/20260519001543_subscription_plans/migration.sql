-- AlterTable
ALTER TABLE "user" ADD COLUMN     "trial_ends_at" TIMESTAMP(6);

UPDATE "user"
SET "trial_ends_at" = "2026-06-30T00:00:00.000Z"
WHERE "trial_ends_at" IS NULL;
