-- Add prompt content versioning (explicit, user-triggered snapshots of PromptContent.content)

-- CreateTable
CREATE TABLE "prompt_content_version" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prompt_id" UUID NOT NULL,
    "version_number" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "note" VARCHAR(500),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_content_version_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prompt_content_version_prompt_id_idx" ON "prompt_content_version"("prompt_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_content_version_prompt_id_version_number_key" ON "prompt_content_version"("prompt_id", "version_number");

-- AddForeignKey
ALTER TABLE "prompt_content_version" ADD CONSTRAINT "prompt_content_version_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
