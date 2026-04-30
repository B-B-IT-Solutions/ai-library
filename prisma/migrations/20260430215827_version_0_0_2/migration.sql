-- DropForeignKey
ALTER TABLE "library_collection_entry" DROP CONSTRAINT "library_collection_entry_entry_id_fkey";

-- DropForeignKey
ALTER TABLE "library_entry" DROP CONSTRAINT "library_entry_template_descriptor_id_fkey";

-- DropForeignKey
ALTER TABLE "library_entry" DROP CONSTRAINT "library_entry_user_id_fkey";

-- DropIndex
DROP INDEX "library_collection_entry_collection_id_entry_id_key";

-- DropIndex
DROP INDEX "library_collection_entry_entry_id_idx";

-- AlterTable
ALTER TABLE "library_collection" ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "public_token" VARCHAR(100);

-- AlterTable
ALTER TABLE "library_collection_entry" DROP COLUMN "entry_id",
ADD COLUMN     "template_descriptor_id" UUID NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "prompt_template_descriptor" ADD COLUMN     "is_favorite" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "library_entry";

-- CreateIndex
CREATE UNIQUE INDEX "library_collection_public_token_key" ON "library_collection"("public_token");

-- CreateIndex
CREATE INDEX "library_collection_entry_template_descriptor_id_idx" ON "library_collection_entry"("template_descriptor_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_collection_entry_collection_id_template_descriptor__key" ON "library_collection_entry"("collection_id", "template_descriptor_id");

-- AddForeignKey
ALTER TABLE "library_collection_entry" ADD CONSTRAINT "library_collection_entry_template_descriptor_id_fkey" FOREIGN KEY ("template_descriptor_id") REFERENCES "prompt_template_descriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "library_collection_entry" ADD CONSTRAINT "library_collection_entry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
