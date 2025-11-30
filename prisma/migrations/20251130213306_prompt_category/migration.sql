/*
  Warnings:

  - You are about to drop the column `categories` on the `prompt` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "prompt" DROP COLUMN "categories";

-- CreateTable
CREATE TABLE "prompt_category" (
    "id" SERIAL NOT NULL,
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
CREATE UNIQUE INDEX "prompt_category_name_key" ON "prompt_category"("name");

-- CreateIndex
CREATE INDEX "_PromptToPromptCategory_B_index" ON "_PromptToPromptCategory"("B");

-- AddForeignKey
ALTER TABLE "_PromptToPromptCategory" ADD CONSTRAINT "_PromptToPromptCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptToPromptCategory" ADD CONSTRAINT "_PromptToPromptCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "prompt_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
