-- CreateTable
CREATE TABLE "prompt_template_global_field" (
    "prompt_template_id" UUID NOT NULL,
    "global_field_id" UUID NOT NULL,

    CONSTRAINT "prompt_template_global_field_pkey" PRIMARY KEY ("prompt_template_id","global_field_id")
);

-- CreateIndex
CREATE INDEX "prompt_template_global_field_prompt_template_id_idx" ON "prompt_template_global_field"("prompt_template_id");

-- AddForeignKey
ALTER TABLE "prompt_template_global_field" ADD CONSTRAINT "prompt_template_global_field_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_template"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_template_global_field" ADD CONSTRAINT "prompt_template_global_field_global_field_id_fkey" FOREIGN KEY ("global_field_id") REFERENCES "global_field"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
