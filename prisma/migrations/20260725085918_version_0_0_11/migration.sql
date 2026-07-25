-- Remove legacy "Prompt0" feature (superseded by the templates-based "Prompt" model)

-- DropForeignKey
ALTER TABLE "prompt0" DROP CONSTRAINT IF EXISTS "prompt0_user_id_fkey";
ALTER TABLE "prompt0_content" DROP CONSTRAINT IF EXISTS "prompt0_content_id_fkey";
ALTER TABLE "prompt0_category" DROP CONSTRAINT IF EXISTS "prompt0_category_user_id_fkey";
ALTER TABLE "prompt0_version" DROP CONSTRAINT IF EXISTS "prompt0_version_prompt_id_fkey";
ALTER TABLE "prompt0_follow_up" DROP CONSTRAINT IF EXISTS "prompt0_follow_up_prompt_id_fkey";
ALTER TABLE "_Prompt0ToPrompt0Category" DROP CONSTRAINT IF EXISTS "_Prompt0ToPrompt0Category_A_fkey";
ALTER TABLE "_Prompt0ToPrompt0Category" DROP CONSTRAINT IF EXISTS "_Prompt0ToPrompt0Category_B_fkey";

-- DropTable
DROP TABLE IF EXISTS "_Prompt0ToPrompt0Category";
DROP TABLE IF EXISTS "prompt0_follow_up";
DROP TABLE IF EXISTS "prompt0_version";
DROP TABLE IF EXISTS "prompt0_content";
DROP TABLE IF EXISTS "prompt0_category";
DROP TABLE IF EXISTS "prompt0";
