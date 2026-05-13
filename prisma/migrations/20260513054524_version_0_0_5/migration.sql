/*
  Warnings:

  - You are about to drop the column `created_at` on the `prompt_content` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `prompt_content` table. All the data in the column will be lost.
  - You are about to drop the `_PromptCategoryToPromptDescriptor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PromptToPromptTemplateCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prompt_descriptor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prompt_follow_up` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prompt_template_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prompt_template_field` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prompt_template_global_field` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prompt_version` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `catalog_entry_field` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `global_field` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `recommended_model` to the `prompt0` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `prompt0` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `prompt0` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `prompt0` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "prompt_field_type" AS ENUM ('TEXT', 'TEXTAREA', 'EMAIL', 'NUMBER', 'DATE', 'SELECT', 'CHECKBOX', 'RADIO');

-- DropForeignKey
ALTER TABLE "_PromptCategoryToPromptDescriptor" DROP CONSTRAINT "_PromptCategoryToPromptDescriptor_A_fkey";

-- DropForeignKey
ALTER TABLE "_PromptCategoryToPromptDescriptor" DROP CONSTRAINT "_PromptCategoryToPromptDescriptor_B_fkey";

-- DropForeignKey
ALTER TABLE "_PromptToPromptTemplateCategory" DROP CONSTRAINT "_PromptToPromptTemplateCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_PromptToPromptTemplateCategory" DROP CONSTRAINT "_PromptToPromptTemplateCategory_B_fkey";

-- DropForeignKey
ALTER TABLE "prompt0" DROP CONSTRAINT "prompt0_id_fkey";

-- DropForeignKey
ALTER TABLE "prompt_descriptor" DROP CONSTRAINT "prompt_descriptor_user_id_fkey";

-- DropForeignKey
ALTER TABLE "prompt_follow_up" DROP CONSTRAINT "prompt_follow_up_prompt_id_fkey";

-- DropForeignKey
ALTER TABLE "prompt_template_category" DROP CONSTRAINT "prompt_template_category_user_id_fkey";

-- DropForeignKey
ALTER TABLE "prompt_template_field" DROP CONSTRAINT "prompt_template_field_prompt_template_id_fkey";

-- DropForeignKey
ALTER TABLE "prompt_template_global_field" DROP CONSTRAINT "prompt_template_global_field_global_field_id_fkey";

-- DropForeignKey
ALTER TABLE "prompt_template_global_field" DROP CONSTRAINT "prompt_template_global_field_prompt_template_id_fkey";

-- DropForeignKey
ALTER TABLE "prompt_version" DROP CONSTRAINT "prompt_version_prompt_id_fkey";

-- AlterTable
ALTER TABLE "catalog_entry_field" DROP COLUMN "type",
ADD COLUMN     "type" "prompt_field_type" NOT NULL;

-- AlterTable
ALTER TABLE "global_field" DROP COLUMN "type",
ADD COLUMN     "type" "prompt_field_type" NOT NULL;

-- AlterTable
ALTER TABLE "prompt0" ADD COLUMN     "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "current_version" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_favorite" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "recommended_model" VARCHAR(250) NOT NULL,
ADD COLUMN     "title" VARCHAR(500) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" UUID NOT NULL,
ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "prompt_content" DROP COLUMN "created_at",
DROP COLUMN "updated_at";

-- DropTable
DROP TABLE "_PromptCategoryToPromptDescriptor";

-- DropTable
DROP TABLE "_PromptToPromptTemplateCategory";

-- DropTable
DROP TABLE "prompt_descriptor";

-- DropTable
DROP TABLE "prompt_follow_up";

-- DropTable
DROP TABLE "prompt_template_category";

-- DropTable
DROP TABLE "prompt_template_field";

-- DropTable
DROP TABLE "prompt_template_global_field";

-- DropTable
DROP TABLE "prompt_version";

-- DropEnum
DROP TYPE "prompt_template_field_type";

-- CreateTable
CREATE TABLE "prompt0_content" (
    "id" UUID NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "prompt0_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt0_category" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "prompt0_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt0_version" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prompt_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt0_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt0_follow_up" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prompt_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt0_follow_up_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_global_field" (
    "prompt_id" UUID NOT NULL,
    "global_field_id" UUID NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "prompt_global_field_pkey" PRIMARY KEY ("prompt_id","global_field_id")
);

-- CreateTable
CREATE TABLE "prompt_field" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prompt_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "label" VARCHAR(250) NOT NULL,
    "description" VARCHAR(500),
    "type" "prompt_field_type" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "default_value" TEXT,
    "options" JSONB,

    CONSTRAINT "prompt_field_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Prompt0ToPrompt0Category" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Prompt0ToPrompt0Category_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_PromptToPromptCategory" (
    "A" UUID NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PromptToPromptCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "prompt0_category_user_id_idx" ON "prompt0_category"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt0_category_user_id_name_key" ON "prompt0_category"("user_id", "name");

-- CreateIndex
CREATE INDEX "prompt0_version_prompt_id_idx" ON "prompt0_version"("prompt_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt0_version_prompt_id_version_key" ON "prompt0_version"("prompt_id", "version");

-- CreateIndex
CREATE INDEX "prompt0_follow_up_prompt_id_idx" ON "prompt0_follow_up"("prompt_id");

-- CreateIndex
CREATE INDEX "prompt_global_field_prompt_id_idx" ON "prompt_global_field"("prompt_id");

-- CreateIndex
CREATE INDEX "prompt_field_prompt_id_idx" ON "prompt_field"("prompt_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_field_prompt_id_name_key" ON "prompt_field"("prompt_id", "name");

-- CreateIndex
CREATE INDEX "_Prompt0ToPrompt0Category_B_index" ON "_Prompt0ToPrompt0Category"("B");

-- CreateIndex
CREATE INDEX "_PromptToPromptCategory_B_index" ON "_PromptToPromptCategory"("B");

-- CreateIndex
CREATE INDEX "prompt0_user_id_idx" ON "prompt0"("user_id");

-- AddForeignKey
ALTER TABLE "prompt0" ADD CONSTRAINT "prompt0_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt0_content" ADD CONSTRAINT "prompt0_content_id_fkey" FOREIGN KEY ("id") REFERENCES "prompt0"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt0_category" ADD CONSTRAINT "prompt0_category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt0_version" ADD CONSTRAINT "prompt0_version_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt0"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt0_follow_up" ADD CONSTRAINT "prompt0_follow_up_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt0"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_global_field" ADD CONSTRAINT "prompt_global_field_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt_content"("prompt_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_global_field" ADD CONSTRAINT "prompt_global_field_global_field_id_fkey" FOREIGN KEY ("global_field_id") REFERENCES "global_field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_field" ADD CONSTRAINT "prompt_field_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt_content"("prompt_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Prompt0ToPrompt0Category" ADD CONSTRAINT "_Prompt0ToPrompt0Category_A_fkey" FOREIGN KEY ("A") REFERENCES "prompt0"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Prompt0ToPrompt0Category" ADD CONSTRAINT "_Prompt0ToPrompt0Category_B_fkey" FOREIGN KEY ("B") REFERENCES "prompt0_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptToPromptCategory" ADD CONSTRAINT "_PromptToPromptCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PromptToPromptCategory" ADD CONSTRAINT "_PromptToPromptCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "prompt_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
