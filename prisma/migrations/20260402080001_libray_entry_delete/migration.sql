-- AlterTable
ALTER TABLE "library_collection_entry" ADD COLUMN     "prompt_template_descriptor_id" UUID;

-- AddForeignKey
ALTER TABLE "library_collection_entry" ADD CONSTRAINT "library_collection_entry_prompt_template_descriptor_id_fkey" FOREIGN KEY ("prompt_template_descriptor_id") REFERENCES "prompt_template_descriptor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
