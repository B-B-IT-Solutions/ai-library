/*
  Warnings:

  - You are about to drop the column `prompt_template_id` on the `prompt_field` table. All the data in the column will be lost.
  - You are about to drop the `_PromptToPromptTemplateCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prompt_template_category` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[prompt_id,name]` on the table `prompt_field` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `prompt_id` to the `prompt_field` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_PromptToPromptTemplateCategory" DROP CONSTRAINT "_PromptToPromptTemplateCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_PromptToPromptTemplateCategory" DROP CONSTRAINT "_PromptToPromptTemplateCategory_B_fkey";

-- DropForeignKey
ALTER TABLE "prompt_field" DROP CONSTRAINT "prompt_field_prompt_template_id_fkey";

-- DropForeignKey
ALTER TABLE "prompt_template_category" DROP CONSTRAINT "prompt_template_category_user_id_fkey";

-- DropIndex
DROP INDEX "prompt_field_prompt_template_id_idx";

-- DropIndex
DROP INDEX "prompt_field_prompt_template_id_name_key";

-- AlterTable
ALTER TABLE "prompt_field" DROP COLUMN "prompt_template_id",
ADD COLUMN     "prompt_id" UUID NOT NULL;

-- DropTable
DROP TABLE "_PromptToPromptTemplateCategory";

-- DropTable
DROP TABLE "prompt_template_category";

-- CreateTable
CREATE TABLE "prompt_category" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "prompt_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PromptToPromptCategory" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PromptToPromptCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "prompt_category_user_id_idx" ON "prompt_category"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_category_user_id_name_key" ON "prompt_category"("user_id", "name");

-- CreateIndex
CREATE INDEX "_PromptToPromptCategory_B_index" ON "_PromptToPromptCategory"("B");

-- CreateIndex
CREATE INDEX "prompt_field_prompt_id_idx" ON "prompt_field"("prompt_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_field_prompt_id_name_key" ON "prompt_field"("prompt_id", "name");

-- AddForeignKey
ALTER TABLE "prompt_field" ADD CONSTRAINT "prompt_field_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt_content"("prompt_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_category" ADD CONSTRAINT "prompt_category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptToPromptCategory" ADD CONSTRAINT "_PromptToPromptCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptToPromptCategory" ADD CONSTRAINT "_PromptToPromptCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "prompt_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
