/*
  Warnings:

  - You are about to drop the `_PromptCategoryToPromptDescriptor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prompt_descriptor` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PromptCategoryToPromptDescriptor" DROP CONSTRAINT "_PromptCategoryToPromptDescriptor_A_fkey";

-- DropForeignKey
ALTER TABLE "_PromptCategoryToPromptDescriptor" DROP CONSTRAINT "_PromptCategoryToPromptDescriptor_B_fkey";

-- DropForeignKey
ALTER TABLE "prompt0_content" DROP CONSTRAINT "prompt0_content_id_fkey";

-- DropForeignKey
ALTER TABLE "prompt_descriptor" DROP CONSTRAINT "prompt_descriptor_user_id_fkey";

-- DropForeignKey
ALTER TABLE "prompt_follow_up" DROP CONSTRAINT "prompt_follow_up_prompt_id_fkey";

-- DropForeignKey
ALTER TABLE "prompt_version" DROP CONSTRAINT "prompt_version_prompt_id_fkey";

-- DropTable
DROP TABLE "_PromptCategoryToPromptDescriptor";

-- DropTable
DROP TABLE "prompt_descriptor";

-- CreateTable
CREATE TABLE "prompt0" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "content" TEXT NOT NULL,
    "recommended_model" VARCHAR(250) NOT NULL,
    "is_favorite" BOOLEAN NOT NULL DEFAULT false,
    "current_version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prompt0_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Prompt0ToPromptCategory" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Prompt0ToPromptCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "prompt0_user_id_idx" ON "prompt0"("user_id");

-- CreateIndex
CREATE INDEX "_Prompt0ToPromptCategory_B_index" ON "_Prompt0ToPromptCategory"("B");

-- AddForeignKey
ALTER TABLE "prompt0" ADD CONSTRAINT "prompt0_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt0_content" ADD CONSTRAINT "prompt0_content_id_fkey" FOREIGN KEY ("id") REFERENCES "prompt0"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_version" ADD CONSTRAINT "prompt_version_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt0"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_follow_up" ADD CONSTRAINT "prompt_follow_up_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt0"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Prompt0ToPromptCategory" ADD CONSTRAINT "_Prompt0ToPromptCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "prompt0"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Prompt0ToPromptCategory" ADD CONSTRAINT "_Prompt0ToPromptCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "prompt_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
