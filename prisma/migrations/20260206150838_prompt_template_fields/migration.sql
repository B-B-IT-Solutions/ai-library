-- CreateEnum
CREATE TYPE "prompt_template_field_type" AS ENUM ('TEXT', 'TEXTAREA', 'EMAIL', 'NUMBER', 'DATE', 'SELECT', 'CHECKBOX', 'RADIO');

-- CreateTable
CREATE TABLE "prompt_template_field" (
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

    CONSTRAINT "prompt_template_field_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prompt_template_field_prompt_template_id_idx" ON "prompt_template_field"("prompt_template_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_template_field_prompt_template_id_name_key" ON "prompt_template_field"("prompt_template_id", "name");

-- AddForeignKey
ALTER TABLE "prompt_template_field" ADD CONSTRAINT "prompt_template_field_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
