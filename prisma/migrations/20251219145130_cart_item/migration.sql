/*
  Warnings:

  - You are about to drop the column `name` on the `cart_item` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `cart_item` table. All the data in the column will be lost.
  - Added the required column `product_name` to the `cart_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_type` to the `cart_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cart_item" DROP COLUMN "name",
DROP COLUMN "type",
ADD COLUMN     "product_name" VARCHAR(250) NOT NULL,
ADD COLUMN     "product_type" "ProductType" NOT NULL;
