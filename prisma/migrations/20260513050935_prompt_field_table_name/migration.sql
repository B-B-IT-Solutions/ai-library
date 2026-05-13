/*
  Warnings:

  - You are about to drop the `prompt_template_field` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "prompt_template_field" DROP CONSTRAINT "prompt_template_field_prompt_template_id_fkey";

-- DropTable
DROP TABLE "prompt_template_field";

-- CreateTable
CREATE TABLE "prompt_field" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prompt_template_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "label" VARCHAR(250) NOT NULL,
    "description" VARCHAR(500),
    "type" "prompt_template_field_type" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "default_value" TEXT,
    "options" JSONB,

    CONSTRAINT "prompt_field_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prompt_field_prompt_template_id_idx" ON "prompt_field"("prompt_template_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_field_prompt_template_id_name_key" ON "prompt_field"("prompt_template_id", "name");

-- AddForeignKey
ALTER TABLE "prompt_field" ADD CONSTRAINT "prompt_field_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_content"("prompt_id") ON DELETE CASCADE ON UPDATE CASCADE;
