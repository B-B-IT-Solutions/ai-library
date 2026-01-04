/*
  Warnings:

  - Added the required column `content` to the `prompt_descriptor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "prompt_descriptor" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "current_version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "prompt_version" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prompt_id" UUID NOT NULL,
    "version" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "title" VARCHAR(500) NOT NULL,
    "categories" VARCHAR(250)[],
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_version_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_follow_up" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prompt_id" UUID NOT NULL,
    "content" VARCHAR(500) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_follow_up_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prompt_version_prompt_id_idx" ON "prompt_version"("prompt_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_version_prompt_id_version_key" ON "prompt_version"("prompt_id", "version");

-- CreateIndex
CREATE INDEX "prompt_follow_up_prompt_id_idx" ON "prompt_follow_up"("prompt_id");

-- AddForeignKey
ALTER TABLE "prompt_version" ADD CONSTRAINT "prompt_version_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt_descriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_follow_up" ADD CONSTRAINT "prompt_follow_up_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt_descriptor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
