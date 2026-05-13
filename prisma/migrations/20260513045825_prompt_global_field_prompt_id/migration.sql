/*
  Warnings:

  - You are about to drop the `prompt_template_global_field` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "prompt_template_global_field" DROP CONSTRAINT "prompt_template_global_field_global_field_id_fkey";

-- DropForeignKey
ALTER TABLE "prompt_template_global_field" DROP CONSTRAINT "prompt_template_global_field_prompt_template_id_fkey";

-- DropTable
DROP TABLE "prompt_template_global_field";

-- CreateTable
CREATE TABLE "prompt_global_field" (
    "prompt_id" UUID NOT NULL,
    "global_field_id" UUID NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "prompt_global_field_pkey" PRIMARY KEY ("prompt_id","global_field_id")
);

-- CreateIndex
CREATE INDEX "prompt_global_field_prompt_id_idx" ON "prompt_global_field"("prompt_id");

-- AddForeignKey
ALTER TABLE "prompt_global_field" ADD CONSTRAINT "prompt_global_field_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt_content"("prompt_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_global_field" ADD CONSTRAINT "prompt_global_field_global_field_id_fkey" FOREIGN KEY ("global_field_id") REFERENCES "global_field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
