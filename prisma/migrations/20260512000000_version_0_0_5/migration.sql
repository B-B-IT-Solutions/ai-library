-- DropForeignKey: remove FKs that reference prompt_content.id
ALTER TABLE "prompt_template_field" DROP CONSTRAINT "prompt_template_field_prompt_template_id_fkey";
ALTER TABLE "prompt_template_global_field" DROP CONSTRAINT "prompt_template_global_field_prompt_template_id_fkey";

-- DropForeignKey + DropIndex: remove prompt.prompt_template_id references
ALTER TABLE "prompt" DROP CONSTRAINT "prompt_prompt_template_id_fkey";
DROP INDEX "prompt_prompt_template_id_key";

-- AddColumn: add prompt_id to prompt_content (nullable first so we can populate)
ALTER TABLE "prompt_content" ADD COLUMN "prompt_id" UUID;

-- Populate prompt_content.prompt_id from prompt.id (via old prompt.prompt_template_id)
UPDATE "prompt_content" pc
SET "prompt_id" = p."id"
FROM "prompt" p
WHERE p."prompt_template_id" = pc."id";

-- Update prompt_template_field.prompt_template_id: old value = prompt_content.id → new value = prompt.id
UPDATE "prompt_template_field" ptf
SET "prompt_template_id" = p."id"
FROM "prompt" p
WHERE p."prompt_template_id" = ptf."prompt_template_id";

-- Update prompt_template_global_field.prompt_template_id: same mapping
-- Drop compound PK first (PK columns cannot be updated while constraint is active on some engines)
ALTER TABLE "prompt_template_global_field" DROP CONSTRAINT "prompt_template_global_field_pkey";
UPDATE "prompt_template_global_field" ptgf
SET "prompt_template_id" = p."id"
FROM "prompt" p
WHERE p."prompt_template_id" = ptgf."prompt_template_id";
ALTER TABLE "prompt_template_global_field" ADD CONSTRAINT "prompt_template_global_field_pkey" PRIMARY KEY ("prompt_template_id", "global_field_id");

-- Make prompt_id NOT NULL
ALTER TABLE "prompt_content" ALTER COLUMN "prompt_id" SET NOT NULL;

-- Swap PK on prompt_content: drop old id-based PK, drop id column, promote prompt_id
ALTER TABLE "prompt_content" DROP CONSTRAINT "prompt_content_pkey";
ALTER TABLE "prompt_content" DROP COLUMN "id";
ALTER TABLE "prompt_content" ADD CONSTRAINT "prompt_content_pkey" PRIMARY KEY ("prompt_id");

-- AddForeignKey: prompt_content.prompt_id → prompt.id
ALTER TABLE "prompt_content" ADD CONSTRAINT "prompt_content_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropColumn: remove prompt_template_id from prompt
ALTER TABLE "prompt" DROP COLUMN "prompt_template_id";

-- AddForeignKey: restore FKs from field tables → prompt_content.prompt_id
ALTER TABLE "prompt_template_field" ADD CONSTRAINT "prompt_template_field_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_content"("prompt_id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "prompt_template_global_field" ADD CONSTRAINT "prompt_template_global_field_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_content"("prompt_id") ON DELETE CASCADE ON UPDATE CASCADE;
