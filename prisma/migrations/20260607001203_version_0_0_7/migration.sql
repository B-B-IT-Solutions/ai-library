-- RenameColumn
ALTER TABLE "library_collection_entry" RENAME  COLUMN  "template_descriptor_id" TO "prompt_id";

-- RenameConstraint
ALTER TABLE "library_collection_entry" RENAME CONSTRAINT "library_collection_entry_template_descriptor_id_fkey" TO "library_collection_entry_prompt_id_fkey";

-- RenameIndex
ALTER INDEX "library_collection_entry_collection_id_template_descriptor__key" RENAME TO "library_collection_entry_collection_id_prompt_id_key";

-- RenameIndex
ALTER INDEX "library_collection_entry_template_descriptor_id_idx" RENAME TO "library_collection_entry_prompt_id_idx";
