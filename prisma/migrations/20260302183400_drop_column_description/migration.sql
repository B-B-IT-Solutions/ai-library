/*
  Warnings:

  - You are about to drop the column `detailed_description` on the `prompt_template` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "prompt_template" DROP COLUMN "detailed_description";
