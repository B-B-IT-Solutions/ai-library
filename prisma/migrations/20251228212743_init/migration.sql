/*
  Warnings:

  - Made the column `product_id` on table `library` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "library" DROP CONSTRAINT "library_product_id_fkey";

-- AlterTable
ALTER TABLE "library" ALTER COLUMN "product_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "library" ADD CONSTRAINT "library_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
