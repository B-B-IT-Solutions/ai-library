/*
  Warnings:

  - Added the required column `name` to the `cart_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `cart_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cart_item" ADD COLUMN     "name" VARCHAR(250) NOT NULL,
ADD COLUMN     "type" "ProductType" NOT NULL;
