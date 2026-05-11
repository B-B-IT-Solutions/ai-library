-- DropForeignKey on join table (both, because A/B roles are about to swap)
ALTER TABLE "_PromptToPromptTemplateCategory" DROP CONSTRAINT "_PromptToPromptTemplateCategory_A_fkey";
ALTER TABLE "_PromptToPromptTemplateCategory" DROP CONSTRAINT "_PromptToPromptTemplateCategory_B_fkey";

-- DropForeignKey from referencing tables
ALTER TABLE "library_collection_entry" DROP CONSTRAINT "library_collection_entry_template_descriptor_id_fkey";
ALTER TABLE "product_item" DROP CONSTRAINT "product_item_template_id_fkey";

-- DropForeignKey on prompt_template_descriptor itself
ALTER TABLE "prompt_template_descriptor" DROP CONSTRAINT "prompt_template_descriptor_prompt_template_id_fkey";
ALTER TABLE "prompt_template_descriptor" DROP CONSTRAINT "prompt_template_descriptor_user_id_fkey";

-- Swap A and B on join table (preserves all data)
-- Before: A=INTEGER (PromptTemplateCategory.id), B=UUID (PromptTemplateDescriptor.id)
-- After:  A=UUID (Prompt.id), B=INTEGER (PromptTemplateCategory.id)
ALTER TABLE "_PromptToPromptTemplateCategory" DROP CONSTRAINT "_PromptToPromptTemplateCategory_AB_pkey";
DROP INDEX "_PromptToPromptTemplateCategory_B_index";
ALTER TABLE "_PromptToPromptTemplateCategory" RENAME COLUMN "A" TO "_swap";
ALTER TABLE "_PromptToPromptTemplateCategory" RENAME COLUMN "B" TO "A";
ALTER TABLE "_PromptToPromptTemplateCategory" RENAME COLUMN "_swap" TO "B";
ALTER TABLE "_PromptToPromptTemplateCategory" ADD CONSTRAINT "_PromptToPromptTemplateCategory_AB_pkey" PRIMARY KEY ("A", "B");
CREATE INDEX "_PromptToPromptTemplateCategory_B_index" ON "_PromptToPromptTemplateCategory"("B");

-- RenameTable (preserves all data)
ALTER TABLE "prompt_template_descriptor" RENAME TO "prompt";

-- Rename primary key constraint
ALTER TABLE "prompt" RENAME CONSTRAINT "prompt_template_descriptor_pkey" TO "prompt_pkey";

-- Rename indexes
ALTER INDEX "prompt_template_descriptor_prompt_template_id_key" RENAME TO "prompt_prompt_template_id_key";
ALTER INDEX "prompt_template_descriptor_user_id_idx" RENAME TO "prompt_user_id_idx";

-- AddForeignKey on prompt table
ALTER TABLE "prompt" ADD CONSTRAINT "prompt_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "prompt" ADD CONSTRAINT "prompt_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_content"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey from referencing tables → prompt
ALTER TABLE "library_collection_entry" ADD CONSTRAINT "library_collection_entry_template_descriptor_id_fkey" FOREIGN KEY ("template_descriptor_id") REFERENCES "prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "product_item" ADD CONSTRAINT "product_item_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey on join table (A=UUID→prompt, B=INTEGER→prompt_template_category)
ALTER TABLE "_PromptToPromptTemplateCategory" ADD CONSTRAINT "_PromptToPromptTemplateCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_PromptToPromptTemplateCategory" ADD CONSTRAINT "_PromptToPromptTemplateCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "prompt_template_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
