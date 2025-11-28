/*
  Warnings:

  - You are about to alter the column `recommended_model` on the `prompt` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.
  - You are about to drop the column `categories` on the `prompt_template` table. All the data in the column will be lost.
  - You are about to alter the column `recommended_model` on the `prompt_template` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.

*/
-- AlterTable
ALTER TABLE "prompt" ALTER COLUMN "recommended_model" SET DATA TYPE VARCHAR(250);

-- AlterTable
ALTER TABLE "prompt_template" DROP COLUMN "categories",
ALTER COLUMN "recommended_model" SET DATA TYPE VARCHAR(250);

-- CreateTable
CREATE TABLE "prompt_template_category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "prompt_template_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PromptTemplateToPromptTemplateCategory" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PromptTemplateToPromptTemplateCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "prompt_template_category_name_key" ON "prompt_template_category"("name");

-- CreateIndex
CREATE INDEX "_PromptTemplateToPromptTemplateCategory_B_index" ON "_PromptTemplateToPromptTemplateCategory"("B");

-- AddForeignKey
ALTER TABLE "_PromptTemplateToPromptTemplateCategory" ADD CONSTRAINT "_PromptTemplateToPromptTemplateCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "prompt_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptTemplateToPromptTemplateCategory" ADD CONSTRAINT "_PromptTemplateToPromptTemplateCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "prompt_template_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
