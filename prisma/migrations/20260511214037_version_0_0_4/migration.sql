-- DropForeignKey
ALTER TABLE "prompt_template_descriptor" DROP CONSTRAINT "prompt_template_descriptor_prompt_template_id_fkey";

-- DropForeignKey
ALTER TABLE "prompt_template_field" DROP CONSTRAINT "prompt_template_field_prompt_template_id_fkey";

-- DropForeignKey
ALTER TABLE "prompt_template_global_field" DROP CONSTRAINT "prompt_template_global_field_prompt_template_id_fkey";

-- RenameTable (preserves all data)
ALTER TABLE "prompt_template" RENAME TO "prompt_content";

-- Rename primary key constraint
ALTER TABLE "prompt_content" RENAME CONSTRAINT "prompt_template_pkey" TO "prompt_content_pkey";

-- AddForeignKey
ALTER TABLE "prompt_template_descriptor" ADD CONSTRAINT "prompt_template_descriptor_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_template_global_field" ADD CONSTRAINT "prompt_template_global_field_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_template_field" ADD CONSTRAINT "prompt_template_field_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "prompt" DROP CONSTRAINT "prompt_id_fkey";

-- RenameTable (preserves all data)
ALTER TABLE "prompt" RENAME TO "prompt0";

-- Rename primary key constraint
ALTER TABLE "prompt0" RENAME CONSTRAINT "prompt_pkey" TO "prompt0_pkey";

-- AddForeignKey
ALTER TABLE "prompt0" ADD CONSTRAINT "prompt0_id_fkey" FOREIGN KEY ("id") REFERENCES "prompt_descriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
