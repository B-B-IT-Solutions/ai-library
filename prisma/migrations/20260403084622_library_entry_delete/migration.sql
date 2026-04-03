/*
  Warnings:

  - You are about to drop the column `entry_id` on the `library_collection_entry` table. All the data in the column will be lost.
  - You are about to drop the `library_entry` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[collection_id,template_descriptor_id]` on the table `library_collection_entry` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `template_descriptor_id` to the `library_collection_entry` table without a default value. This is not possible if the table is not empty.

*/
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
ALTER TABLE "library_collection_entry" DROP COLUMN "entry_id",
ADD COLUMN     "template_descriptor_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "prompt_template_descriptor" ADD COLUMN     "is_favorite" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "library_entry";

-- CreateIndex
CREATE INDEX "library_collection_entry_template_descriptor_id_idx" ON "library_collection_entry"("template_descriptor_id");

-- CreateIndex
CREATE UNIQUE INDEX "library_collection_entry_collection_id_template_descriptor__key" ON "library_collection_entry"("collection_id", "template_descriptor_id");

-- AddForeignKey
ALTER TABLE "library_collection_entry" ADD CONSTRAINT "library_collection_entry_template_descriptor_id_fkey" FOREIGN KEY ("template_descriptor_id") REFERENCES "prompt_template_descriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
