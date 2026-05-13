/*
  Warnings:

  - You are about to drop the `prompt_follow_up` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "prompt_follow_up" DROP CONSTRAINT "prompt_follow_up_prompt_id_fkey";

-- DropTable
DROP TABLE "prompt_follow_up";

-- CreateTable
CREATE TABLE "prompt0_follow_up" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "prompt_id" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt0_follow_up_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "prompt0_follow_up_prompt_id_idx" ON "prompt0_follow_up"("prompt_id");

-- AddForeignKey
ALTER TABLE "prompt0_follow_up" ADD CONSTRAINT "prompt0_follow_up_prompt_id_fkey" FOREIGN KEY ("prompt_id") REFERENCES "prompt0"("id") ON DELETE CASCADE ON UPDATE CASCADE;
