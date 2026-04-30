-- AlterTable: add nullable first to allow backfill
ALTER TABLE "library_collection_entry" ADD COLUMN "user_id" UUID;

-- Backfill user_id from the related collection
UPDATE "library_collection_entry" lce
SET "user_id" = lc."user_id"
FROM "library_collection" lc
WHERE lce."collection_id" = lc."id";

-- Now enforce NOT NULL
ALTER TABLE "library_collection_entry" ALTER COLUMN "user_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "library_collection_entry_user_id_idx" ON "library_collection_entry"("user_id");

-- AddForeignKey
ALTER TABLE "library_collection_entry" ADD CONSTRAINT "library_collection_entry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
