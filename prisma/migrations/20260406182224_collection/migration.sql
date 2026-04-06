/*
  Warnings:

  - A unique constraint covering the columns `[public_token]` on the table `library_collection` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "library_collection" ADD COLUMN     "is_public" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "public_token" VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "library_collection_public_token_key" ON "library_collection"("public_token");
