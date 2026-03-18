/*
  Warnings:

  - Added the required column `user_id` to the `prompt_template_descriptor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prompt_template_descriptor" ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "prompt_template_descriptor_user_id_idx" ON "prompt_template_descriptor"("user_id");

-- AddForeignKey
ALTER TABLE "prompt_template_descriptor" ADD CONSTRAINT "prompt_template_descriptor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
