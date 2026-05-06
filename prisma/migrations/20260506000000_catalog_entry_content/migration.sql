-- CreateTable
CREATE TABLE "catalog_entry_content" (
    "catalog_entry_id" UUID NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "catalog_entry_content_pkey" PRIMARY KEY ("catalog_entry_id")
);

-- MigrateData: move existing content into the new table
INSERT INTO "catalog_entry_content" ("catalog_entry_id", "content")
SELECT "id", "content"
FROM "catalog_entry";

-- AlterTable: drop the content column from catalog_entry
ALTER TABLE "catalog_entry" DROP COLUMN "content";

-- AddForeignKey
ALTER TABLE "catalog_entry_content" ADD CONSTRAINT "catalog_entry_content_catalog_entry_id_fkey" FOREIGN KEY ("catalog_entry_id") REFERENCES "catalog_entry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
