/*
  Warnings:

  - You are about to drop the `_Prompt0ToPromptCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prompt_category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Prompt0ToPromptCategory" DROP CONSTRAINT "_Prompt0ToPromptCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_Prompt0ToPromptCategory" DROP CONSTRAINT "_Prompt0ToPromptCategory_B_fkey";

-- DropForeignKey
ALTER TABLE "prompt_category" DROP CONSTRAINT "prompt_category_user_id_fkey";

-- DropTable
DROP TABLE "_Prompt0ToPromptCategory";

-- DropTable
DROP TABLE "prompt_category";

-- CreateTable
CREATE TABLE "prompt0_category" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "prompt0_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Prompt0ToPrompt0Category" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Prompt0ToPrompt0Category_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "prompt0_category_user_id_idx" ON "prompt0_category"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt0_category_user_id_name_key" ON "prompt0_category"("user_id", "name");

-- CreateIndex
CREATE INDEX "_Prompt0ToPrompt0Category_B_index" ON "_Prompt0ToPrompt0Category"("B");

-- AddForeignKey
ALTER TABLE "prompt0_category" ADD CONSTRAINT "prompt0_category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Prompt0ToPrompt0Category" ADD CONSTRAINT "_Prompt0ToPrompt0Category_A_fkey" FOREIGN KEY ("A") REFERENCES "prompt0"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Prompt0ToPrompt0Category" ADD CONSTRAINT "_Prompt0ToPrompt0Category_B_fkey" FOREIGN KEY ("B") REFERENCES "prompt0_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
