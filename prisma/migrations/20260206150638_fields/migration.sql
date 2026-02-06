/*
  Warnings:

  - You are about to drop the column `created_at` on the `prompt_template_field` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "prompt_template_field" DROP COLUMN "created_at";
