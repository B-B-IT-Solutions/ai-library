/*
  Warnings:

  - You are about to drop the `prompt_version` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "prompt_version" DROP CONSTRAINT "prompt_version_prompt_id_fkey";

-- DropTable
DROP TABLE "prompt_version";

-- CreateTable
CREATE TABLE "prompt0_version" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prompt_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt0_version_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prompt0_version_prompt_id_idx" ON "prompt0_version"("prompt_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt0_version_prompt_id_version_key" ON "prompt0_version"("prompt_id", "version");

-- AddForeignKey
ALTER TABLE "prompt0_version" ADD CONSTRAINT "prompt0_version_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt0"("id") ON DELETE CASCADE ON UPDATE CASCADE;
