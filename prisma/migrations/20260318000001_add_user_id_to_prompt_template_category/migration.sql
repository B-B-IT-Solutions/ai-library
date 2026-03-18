-- AlterTable
ALTER TABLE "prompt_template_category" ADD COLUMN "user_id" UUID NOT NULL;

-- DropIndex
DROP INDEX "prompt_template_category_name_key";

-- CreateIndex
CREATE INDEX "prompt_template_category_user_id_idx" ON "prompt_template_category"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_template_category_user_id_name_key" ON "prompt_template_category"("user_id", "name");

-- AddForeignKey
ALTER TABLE "prompt_template_category" ADD CONSTRAINT "prompt_template_category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
