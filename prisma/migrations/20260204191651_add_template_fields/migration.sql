-- CreateEnum
CREATE TYPE "TemplateFieldType" AS ENUM ('TEXT', 'TEXTAREA', 'SELECT', 'CHECKBOX', 'RADIO', 'NUMBER', 'DATE', 'EMAIL');

-- CreateTable
CREATE TABLE "template_field" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prompt_template_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "label" VARCHAR(250) NOT NULL,
    "description" VARCHAR(500),
    "type" "TemplateFieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "default_value" TEXT,
    "options" JSONB,
    "validation" JSONB,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "template_field_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "template_field_prompt_template_id_idx" ON "template_field"("prompt_template_id");

-- CreateIndex
CREATE UNIQUE INDEX "template_field_prompt_template_id_name_key" ON "template_field"("prompt_template_id", "name");

-- AddForeignKey
ALTER TABLE "template_field" ADD CONSTRAINT "template_field_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;
