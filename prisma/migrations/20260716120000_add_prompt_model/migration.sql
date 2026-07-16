-- CreateTable
CREATE TABLE "prompt_model" (
    "id" SERIAL NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(250) NOT NULL,

    CONSTRAINT "prompt_model_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prompt_model_user_id_idx" ON "prompt_model"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_model_user_id_name_key" ON "prompt_model"("user_id", "name");

-- AddForeignKey
ALTER TABLE "prompt_model" ADD CONSTRAINT "prompt_model_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed default models for every existing user
INSERT INTO "prompt_model" ("user_id", "name")
SELECT u."id", v."name"
FROM "user" u
CROSS JOIN (VALUES ('Claude'), ('ChatGPT'), ('Gemini'), ('Perplexity'), ('Midjourney')) AS v("name")
ON CONFLICT ("user_id", "name") DO NOTHING;

-- Backfill models from recommended_model values actually used on existing prompts
INSERT INTO "prompt_model" ("user_id", "name")
SELECT DISTINCT p."user_id", p."recommended_model"
FROM "prompt" p
WHERE p."recommended_model" IS NOT NULL AND p."recommended_model" <> ''
ON CONFLICT ("user_id", "name") DO NOTHING;

-- AlterTable
ALTER TABLE "prompt" ADD COLUMN "model_id" INTEGER;

-- Backfill prompt.model_id from prompt_model by matching (user_id, recommended_model)
UPDATE "prompt" p
SET "model_id" = pm."id"
FROM "prompt_model" pm
WHERE pm."user_id" = p."user_id" AND pm."name" = p."recommended_model";

-- AlterTable
ALTER TABLE "prompt" DROP COLUMN "recommended_model";

-- CreateIndex
CREATE INDEX "prompt_model_id_idx" ON "prompt"("model_id");

-- AddForeignKey
ALTER TABLE "prompt" ADD CONSTRAINT "prompt_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "prompt_model"("id") ON DELETE SET NULL ON UPDATE CASCADE;
