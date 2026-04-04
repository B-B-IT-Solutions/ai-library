/*
  Warnings:

  - A unique constraint covering the columns `[share_token]` on the table `library_collection` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "library_collection" ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "share_token" VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "library_collection_share_token_key" ON "library_collection"("share_token");
