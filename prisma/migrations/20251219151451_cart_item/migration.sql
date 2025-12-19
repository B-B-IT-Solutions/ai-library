/*
  Warnings:

  - Added the required column `product_price` to the `cart_item` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cart_item" ADD COLUMN     "product_price" DECIMAL(10,2) NOT NULL;
