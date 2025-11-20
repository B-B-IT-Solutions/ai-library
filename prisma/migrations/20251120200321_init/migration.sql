/*
  Warnings:

  - Added the required column `current_verion` to the `prompt` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prompt" ADD COLUMN     "current_verion" INTEGER NOT NULL,
ADD COLUMN     "follow_up_prompts" TEXT[];
